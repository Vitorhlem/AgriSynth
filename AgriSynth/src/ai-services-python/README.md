# Microsserviços de IA (Python)

Esta pasta contém todos os microsserviços especializados em Inteligência Artificial, cada um com uma responsabilidade única.

## Tecnologias Comuns

-   **Linguagem:** Python
-   **Framework Web:** FastAPI
-   **Containerização:** Docker

---

### Serviço: `nlp-service`

-   **Propósito:** Extrair dados estruturados de laudos de solo em formato PDF.
-   **Modelos/Bibliotecas:** `spaCy`, `PyMuPDF`.
-   **Endpoint:** `POST /api/v1/extract-soil-data`

---

### Serviço: `vision-service`

-   **Propósito:** Analisar imagens de lavoura para extrair métricas como o percentual de cobertura vegetal.
-   **Modelos/Bibliotecas:** `Ultralytics (YOLOv8)`, `Pillow`, `NumPy`.
-   **Endpoint:** `POST /api/v1/analyze-plot`

---

### Serviço: `scenario-synthesizer`

-   **Propósito:** O cérebro do AgriSynth. Usa IA Generativa para criar cenários de cultivo e ML Preditivo para simular seus resultados.
-   **Modelos/Bibliotecas:** `Transformers (LLMs)`, `Scikit-learn`, `Pandas`.
-   **Endpoint:** `POST /api/v1/synthesize`
