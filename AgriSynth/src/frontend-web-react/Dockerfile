# Generated Dockerfile
# 2025
# Vitor (usuário) & Gemini
# AgriSynth
# 01/08/2025
#
# DESCRIÇÃO: Dockerfile para construir a imagem de produção do frontend-web-react.

# --- ESTÁGIO 1: BUILDER ---
# Começa com uma imagem Node.js para construir o projeto
FROM node:20-alpine as builder

WORKDIR /app

# Copia os arquivos de manifesto do projeto
COPY package.json ./
# Se você tiver um package-lock.json, é bom copiá-lo também
# COPY package-lock.json ./

# Instala todas as dependências do projeto
RUN npm install

# Copia todo o resto do código-fonte
COPY . .

# Executa o script de build definido no package.json
# Isso cria a pasta /app/dist com os arquivos estáticos otimizados
RUN npm run build


# --- ESTÁGIO 2: PRODUCTION ---
# Começa com uma imagem Nginx super leve para servir os arquivos
FROM nginx:stable-alpine

# Copia os arquivos estáticos compilados do estágio 'builder' para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
# Este arquivo garante que a navegação do React (rotas) funcione corretamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O comando padrão do Nginx já inicia o servidor, então não precisamos de um CMD