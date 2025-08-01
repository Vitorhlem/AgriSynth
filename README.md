# AgriSynth 🛰️🌱

**AgriSynth** é uma plataforma de simulação baseada em IA que cria "gêmeos digitais" (Digital Twins) de terrenos agrícolas, permitindo que agrônomos e agricultores testem e gerem cenários de cultivo otimizados (clima, solo, insumos) antes de plantar uma única semente, transformando o risco da experimentação em uma vantagem estratégica.

---

## ✨ Funcionalidades Principais

-   **Criação de Gêmeos Digitais:** Crie projetos geoespaciais desenhando a área do seu talhão em um mapa interativo.
-   **Análise de Laudo de Solo (IA):** Faça o upload de um laudo em PDF e a IA de PLN (spaCy) extrairá os dados de nutrientes de forma estruturada.
-   **Análise de Imagem (IA):** Suba uma imagem de drone ou satélite e a IA de Visão Computacional (YOLOv8) calculará o percentual de cobertura vegetal.
-   **Sintetizador de Cenários (IA):** Defina seus objetivos (ex: maximizar lucro) e a IA Generativa (LLM) criará múltiplos planos de cultivo, com a produtividade simulada por um modelo preditivo.
-   **Histórico Persistente:** Todas as análises e cenários gerados são salvos e associados ao seu projeto, criando um histórico valioso para tomada de decisão.

---

## 🏛️ Arquitetura e Stack Tecnológico

O projeto é construído sobre uma arquitetura de microsserviços para garantir escalabilidade e resiliência.

-   **Frontend:** **React (Vite) com TypeScript**, Material-UI, Leaflet (mapas) e Leaflet-Draw.
-   **Backend (API Gateway):** **Go (Golang)** com Gin para alta performance e GORM para acesso ao banco.
-   **Backend (Microsserviços de IA):** **Python (FastAPI)**, o padrão da indústria para servir modelos de IA.
-   **Banco de Dados Primário:** **PostgreSQL com PostGIS** para dados geoespaciais.
-   **Containerização:** **Docker** e **Docker Compose** para orquestrar todo o ambiente de desenvolvimento.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para ter o ambiente completo do AgriSynth rodando em sua máquina.

### 1. Pré-requisitos

-   [Docker e Docker Compose](https://www.docker.com/products/docker-desktop/)
-   [Node.js e npm](https://nodejs.org/) (versão LTS recomendada)
-   [Git](https://git-scm.com/downloads) (opcional, mas recomendado)

### 2. Configuração

1.  Clone este repositório para a sua máquina local.
2.  Abra um terminal e navegue até a pasta raiz do projeto.

### 3. Instalação (Opcional, para o VS Code)

Para que seu editor de código entenda as dependências do frontend e forneça um bom autocompletar, execute:

```bash
cd src/frontend-web-react
npm install
cd ../..
```

### 4. Execução

No terminal, na pasta raiz do projeto, execute o comando:

```bash
docker-compose up --build
```

A primeira execução pode demorar vários minutos. Após a conclusão, acesse a aplicação em:

-   **Frontend:** [http://localhost:5173](http://localhost:5173)
-   **API Gateway (Health Check):** [http://localhost:8080/health](http://localhost:8080/health)

Para parar todos os serviços, volte ao terminal e pressione `Ctrl + C`.

---

## 📁 Estrutura do Projeto

```
📁 agrisynth/
├─── 📄 README.md
├─── 📄 docker-compose.yml
├─── 📄 .gitignore
├─── 📄 LICENSE
├─── 📄 CONTRIBUTING.md
├─── 📁 .github/
└─── 📁 src/
    ├─── 📁 api-gateway-go/
    ├─── 📁 ai-services-python/
    │   ├─── 📁 vision-service/
    │   ├─── 📁 nlp-service/
    │   └─── 📁 scenario-synthesizer/
    └─── 📁 frontend-web-react/
```
