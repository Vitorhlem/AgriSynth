# // Vitor h. Lemes

import io
import logging
from typing import Dict, List

import fitz  # PyMuPDF
import spacy
from fastapi import FastAPI, File, UploadFile, HTTPException
from spacy.matcher import Matcher

# --- CONFIGURAÇÃO INICIAL ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgriSynth - NLP Service",
    description="Microsserviço para extrair dados estruturados de laudos de solo em PDF.",
    version="1.0.0"
)

# --- CARREGAMENTO DE MODELOS E CONFIGURAÇÃO DO MATCHER (NA INICIALIZAÇÃO) ---
nlp_model = None
matcher = None
try:
    logger.info("Carregando o modelo de linguagem (spaCy)...")
    nlp_model = spacy.load("pt_core_news_md")
    logger.info("Modelo de linguagem carregado com sucesso.")

    # Inicializa o Matcher com o vocabulário do modelo.
    matcher = Matcher(nlp_model.vocab)
    
    # Define os padrões para encontrar os dados do laudo.
    # Cada padrão é uma lista de dicionários, onde cada dicionário descreve um token.
    patterns = {
        "PH_H2O": [[{"LOWER": "ph"}, {"IS_PUNCT": True, "OP": "?"}, {"LIKE_NUM": True}]],
        "P_PPM": [[{"LOWER": "fósforo"}, {"LOWER": "(p)"}, {"IS_PUNCT": True, "OP": "*"}, {"LIKE_NUM": True}]],
        "K_PPM": [[{"LOWER": "potássio"}, {"LOWER": "(k)"}, {"IS_PUNCT": True, "OP": "*"}, {"LIKE_NUM": True}]],
        "ORGANIC_MATTER": [[{"LOWER": "m.o."}, {"IS_PUNCT": True, "OP": "*"}, {"LIKE_NUM": True}]]
    }

    for key, pattern_list in patterns.items():
        matcher.add(key, pattern_list)
    logger.info("Matcher do spaCy configurado com sucesso.")

except OSError:
    logger.error("Modelo 'pt_core_news_md' não encontrado. Certifique-se de que foi instalado.")
# --- FIM DA CONFIGURAÇÃO ---


# --- ENDPOINTS DA API ---

@app.get("/health", tags=["Monitoring"])
async def health_check() -> Dict[str, str]:
    return {"status": "UP", "model_loaded": nlp_model is not None, "matcher_configured": matcher is not None}

@app.post("/api/v1/extract-soil-data", tags=["Extraction"])
async def extract_data_from_pdf(pdf_file: UploadFile = File(...)) -> Dict:
    if not pdf_file.content_type == 'application/pdf':
        raise HTTPException(status_code=400, detail="Arquivo inválido. Por favor, envie um PDF.")
    if not matcher or not nlp_model:
        raise HTTPException(status_code=503, detail="Modelo de NLP ou Matcher não está disponível.")

    logger.info(f"Recebido PDF para extração: {pdf_file.filename}")
    full_text = ""
    try:
        pdf_bytes = await pdf_file.read()
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page in doc:
                full_text += page.get_text("text", flags=fitz.TEXTFLAGS_SEARCH) + " "
        logger.info(f"Texto extraído do PDF com sucesso ({len(full_text)} caracteres).")
    except Exception as e:
        logger.error(f"Falha ao processar o PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Não foi possível ler o arquivo PDF.")
    
    # --- LÓGICA DE PLN REAL ---
    doc = nlp_model(full_text.replace(',', '.')) # Normaliza vírgula para ponto decimal
    matches = matcher(doc)

    extracted_data = {}
    logger.info(f"Encontrados {len(matches)} padrões no texto.")
    for match_id, start, end in matches:
        rule_id = nlp_model.vocab.strings[match_id]  # Pega o nome da regra (ex: "PH_H2O")
        span = doc[start:end]                        # O trecho de texto que casou com o padrão
        
        # O valor numérico é geralmente o último token do span
        numeric_token = span[-1]
        if numeric_token.like_num:
            extracted_data[rule_id.lower()] = float(numeric_token.text)
    
    logger.info(f"Dados extraídos: {extracted_data}")
    # --- FIM DA LÓGICA DE PLN ---

    return {
        "filename": pdf_file.filename,
        "analysis_source": "spaCy Matcher Extraction",
        "extracted_data": extracted_data
    }