# AgriSynth

**AgriSynth** é uma plataforma de simulação baseada em IA que cria "gêmeos digitais" (Digital Twins) de terrenos agrícolas, permitindo que agrônomos e agricultores testem e gerem cenários de cultivo otimizados (clima, solo, insumos) antes de plantar uma única semente, transformando o risco da experimentação em uma vantagem estratégica.

---

## 🏛️ Arquitetura e Stack Tecnológico

O projeto é construído sobre uma arquitetura de microsserviços para garantir escalabilidade, resiliência e manutenibilidade.

* **Frontend:** **React (Vite) com TypeScript** e Mapbox GL JS.
* **Backend (API Gateway):** **Go (Golang)** para alta performance.
* **Backend (Microsserviços de IA):** **Python (FastAPI)** para servir os modelos de IA/ML.
* **Banco de Dados Primário:** **PostgreSQL com PostGIS** para dados geoespaciais.
* **Vector Database:** **Chroma** para busca semântica.
* **Cloud & DevOps:** **AWS (EKS, S3, RDS)**, **Docker**, **Kubernetes**, **GitHub Actions** e **Terraform**.

## 📁 Estrutura do Projeto

A estrutura de pastas foi projetada para separar claramente as responsabilidades de cada parte da aplicação:

```
📁 agrisynth/
├─── 📄 README.md
├─── 📄 docker-compose.yml
├─── 📁 .github/
│   └─── 📁 workflows/
├─── 📁 infra/
│   └─── 📁 terraform/
├─── 📁 src/
│   ├─── 📁 api-gateway-go/
│   ├─── 📁 ai-services-python/
│   │   ├─── 📁 vision-service/
│   │   ├─── 📁 nlp-service/
│   │   └─── 📁 scenario-synthesizer/
│   └─── 📁 frontend-web-react/
└─── 📁 docs/
```

## 🚀 Como Começar

Para configurar o ambiente de desenvolvimento local, você precisará ter o **Docker** e o **Docker Compose** instalados.

1.  **Clone o repositório (se aplicável):**
    ```bash
    # Exemplo, caso o projeto estivesse no Git
    git clone <url-do-repositorio> D:\Vitor\AgrySinth
    cd D:\Vitor\AgrySinth
    ```

2.  **Construa e execute os contêineres:**
    O arquivo `docker-compose.yml` orquestrará todos os serviços (frontend, gateway, serviços de IA e bancos de dados).
    ```bash
    docker-compose up --build
    ```

3.  **Acesse os serviços:**
    * **Frontend:** `http://localhost:5173` (porta padrão do Vite)
    * **API Gateway (Go):** `http://localhost:8080`
    * **Serviços de IA (Python/FastAPI):** Portas individuais como `8001`, `8002`, `8003`.

---
