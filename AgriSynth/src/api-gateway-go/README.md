# API Gateway (Go)

Este serviço é o ponto de entrada principal para todas as requisições do frontend.

## Responsabilidades

-   Gerenciar o CRUD completo para a entidade `Project`.
-   Orquestrar as chamadas para os microsserviços de IA.
-   Autenticar e autorizar usuários (funcionalidade futura).
-   Persistir os resultados das análises no banco de dados.

## Tecnologias

-   **Linguagem:** Go (Golang)
-   **Framework Web:** Gin
-   **ORM:** GORM
-   **Banco de Dados:** PostgreSQL com PostGIS

## Endpoints Principais

-   `POST /api/v1/projects`: Cria um novo projeto.
-   `GET /api/v1/projects`: Lista todos os projetos.
-   `GET /api/v1/projects/:id`: Busca um projeto específico.
-   `POST /api/v1/projects/:id/upload-soil-report`: Envia um PDF para o `nlp-service`.
-   `POST /api/v1/projects/:id/upload-plot-image`: Envia uma imagem para o `vision-service`.
-   `POST /api/v1/scenarios/:projectId`: Envia uma requisição para o `scenario-synthesizer`.
