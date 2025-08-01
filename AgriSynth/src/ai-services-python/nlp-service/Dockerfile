# Vitor
# AgriSynth
# 01/08/2025
#
# DESCRIÇÃO: Dockerfile para construir a imagem do nlp-service em Python.

# Começa com uma imagem base oficial do Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY requirements.txt .

# Instala as dependências listadas no requirements.txt
# O spaCy e seu modelo serão baixados e instalados nesta etapa.
RUN pip install --no-cache-dir -r requirements.txt

# Agora copia todo o resto do código-fonte do serviço para o diretório de trabalho
COPY . .

# Expõe a porta que o serviço irá escutar, conforme definido no docker-compose.yml
EXPOSE 8002

# O comando para iniciar a aplicação quando o contêiner for executado.
# Aponta para o objeto 'app' no arquivo 'main.py'.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
