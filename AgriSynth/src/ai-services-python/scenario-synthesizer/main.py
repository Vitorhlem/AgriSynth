// Vitor h. Lemes

import logging
from typing import Dict, List, Any
import json
from pydantic import BaseModel, Field

from fastapi import FastAPI, HTTPException
import pandas as pd
from sklearn.dummy import DummyRegressor # Usaremos um modelo simples para simulação
from transformers import pipeline

# --- CONFIGURAÇÃO INICIAL ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgriSynth - Scenario Synthesizer",
    description="Microsserviço cérebro do sistema, responsável por gerar e simular cenários.",
    version="1.0.0"
)

# --- CARREGAMENTO DE MODELOS NA INICIALIZAÇÃO ---
llm_generator = None
yield_predictor = None
try:
    logger.info("Carregando pipeline de IA Generativa (LLM)...")
    # Usaremos um modelo de instrução relativamente pequeno e de alta performance.
    # Na primeira execução, o 'transformers' fará o download do modelo (pode demorar).
    llm_generator = pipeline("text-generation", model="meta-llama/Llama-3-8B-Instruct", device_map="auto")
    logger.info("Pipeline de LLM carregado com sucesso.")

    # Para o modelo preditivo, usaremos um 'Dummy' que sempre prevê a média.
    # Em um projeto real, carregaríamos um modelo treinado (ex: XGBoost, RandomForest).
    # Ex: yield_predictor = joblib.load('yield_model.pkl')
    yield_predictor = DummyRegressor(strategy="mean")
    # "Treinamos" o modelo dummy com dados de exemplo para que ele tenha uma média para prever.
    dummy_X = pd.DataFrame({'crop_soja': [1, 0], 'crop_milho': [0, 1], 'density_seeds_ha': [300000, 60000]})
    dummy_y = pd.Series([70, 180]) # Média de produtividade para soja e milho
    yield_predictor.fit(dummy_X, dummy_y)
    logger.info("Modelo preditivo de produtividade carregado e 'treinado'. (Simulado)")

except Exception as e:
    logger.error(f"Falha crítica ao carregar modelos de IA: {e}")
# --- FIM DO CARREGAMENTO ---


class SynthesisRequest(BaseModel):
    project_id: str = Field(..., description="ID do projeto/talhão a ser simulado.")
    goals: Dict[str, Any] = Field(..., description="Dicionário com os objetivos do usuário.")
    plot_data: Dict[str, Any] = Field({}, description="Dados do talhão, ex: {'soil_ph': 6.5, 'organic_matter': 3.2}")


def build_llm_prompt(goals: Dict, plot_data: Dict) -> str:
    # A engenharia de prompt é crucial para obter bons resultados do LLM.
    prompt = f"""
    Você é um agrônomo especialista e consultor de agricultura de precisão.
    Sua tarefa é gerar 3 cenários de cultivo inovadores para um talhão com as seguintes características: {plot_data}.
    Os objetivos do agricultor são: {goals}.

    Para cada cenário, forneça um plano de cultivo detalhado.
    Responda APENAS com uma lista de objetos JSON, sem nenhum texto ou explicação adicional.
    O formato de cada objeto JSON deve ser:
    {{
        "scenario_name": "Um nome descritivo para o cenário",
        "cultivation_plan": {{
            "crop": "nome da cultura (ex: Soja, Milho, Algodão)",
            "variety": "sugestão de variedade",
            "density_seeds_ha": um número para a densidade de sementes por hectare
        }},
        "justification": "Uma breve justificativa de como este cenário atende aos objetivos."
    }}

    JSON:
    """
    return prompt

@app.get("/health", tags=["Monitoring"])
async def health_check() -> Dict[str, str]:
    return {"status": "UP", "llm_loaded": llm_generator is not None, "predictor_loaded": yield_predictor is not None}

@app.post("/api/v1/synthesize", tags=["Synthesis"])
async def synthesize_scenarios(request: SynthesisRequest) -> Dict[str, Any]:
    if not llm_generator or not yield_predictor:
        raise HTTPException(status_code=503, detail="Modelos de IA não estão disponíveis.")

    logger.info(f"Requisição para sintetizar cenários para o projeto: {request.project_id} com objetivos: {request.goals}")

    # --- ETAPA 1: FASE GENERATIVA (USANDO LLM) ---
    prompt = build_llm_prompt(request.goals, request.plot_data)
    try:
        raw_output = llm_generator(prompt, max_new_tokens=1024, num_return_sequences=1, temperature=0.7, do_sample=True)
        # O LLM retorna o prompt + a resposta; pegamos apenas a parte da resposta.
        json_output_str = raw_output[0]['generated_text'].split("JSON:")[1].strip()
        generated_scenarios = json.loads(json_output_str)
        logger.info(f"LLM gerou {len(generated_scenarios)} cenários.")
    except (json.JSONDecodeError, IndexError, Exception) as e:
        logger.error(f"Falha ao gerar ou decodificar a resposta do LLM: {e}")
        raise HTTPException(status_code=500, detail="Ocorreu um erro na geração de cenários pela IA.")
    
    # --- ETAPA 2: FASE PREDITIVA (USANDO ML) ---
    logger.info("Iniciando fase preditiva...")
    for scenario in generated_scenarios:
        try:
            plan = scenario['cultivation_plan']
            # Criação de features para o modelo preditivo (exemplo simples)
            features = {
                'crop_soja': 1 if plan['crop'].lower() == 'soja' else 0,
                'crop_milho': 1 if plan['crop'].lower() == 'milho' else 0,
                'density_seeds_ha': plan['density_seeds_ha']
            }
            df_features = pd.DataFrame([features])
            
            # Executa a predição de produtividade
            predicted_yield = yield_predictor.predict(df_features)[0]
            
            scenario['simulation_results'] = {
                "predicted_yield_sacks_ha": round(predicted_yield, 2)
            }
        except Exception as e:
            logger.warning(f"Falha ao simular o cenário '{scenario['scenario_name']}': {e}")
            scenario['simulation_results'] = {"error": "Falha na simulação preditiva."}
            
    return {
        "project_id": request.project_id,
        "scenarios": generated_scenarios
    }