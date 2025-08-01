# 2025
# Vitor 
# AgriSynth
# 01/08/2025
#
# DESCRIÇÃO: Dockerfile para construir a imagem do vision-service em Python.

# Começa com uma imagem base oficial do Python. A tag 'slim' é mais leve que a padrão.
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY requirements.txt .

# Instala as dependências listadas no requirements.txt
# --no-cache-dir evita o armazenamento de cache, mantendo a imagem menor
RUN pip install --no-cache-dir -r requirements.txt

# Agora copia todo o resto do código-fonte do serviço para o diretório de trabalho
COPY . .

# Expõe a porta que o serviço irá escutar, conforme definido no docker-compose.yml
EXPOSE 8001

# O comando para iniciar a aplicação quando o contêiner for executado.
# Ele inicia o servidor Uvicorn, apontando para o objeto 'app' no arquivo 'main.py'.
# --host 0.0.0.0 torna o servidor acessível a partir de fora do contêiner.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
