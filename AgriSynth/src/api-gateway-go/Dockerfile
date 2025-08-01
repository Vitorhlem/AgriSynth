# 2025
# Vitor
# AgriSynth
# 01/08/2025
#
# DESCRIÇÃO: Dockerfile para construir a imagem de produção do api-gateway-go.
# Utiliza um multi-stage build para criar uma imagem final leve.

# --- Estágio 1: Builder ---
# Usa uma imagem oficial do Go para construir o executável
FROM golang:1.22-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de gerenciamento de dependências
COPY go.mod ./

# Baixa as dependências. O Docker irá cachear esta camada.
RUN go mod download

# Copia todo o código-fonte do projeto para o contêiner
COPY . .

# Compila a aplicação.
# CGO_ENABLED=0 cria um binário estático, sem depender de bibliotecas C do sistema.
# -o /app/server especifica o nome e local do arquivo de saída.
RUN CGO_ENABLED=0 go build -o /app/server ./cmd/server/main.go

# --- Estágio 2: Final ---
# Usa uma imagem base mínima para a imagem final
FROM alpine:latest

WORKDIR /app

# Copia APENAS o executável compilado do estágio 'builder'
COPY --from=builder /app/server .

# Expõe a porta que a aplicação usará para comunicação
EXPOSE 8080

# Comando que será executado quando o contêiner iniciar
CMD ["./server"]
