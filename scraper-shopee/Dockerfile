FROM node:18-alpine

# Define o diretório de trabalho. Tudo bem ser /app
WORKDIR /app

# --- A CORREÇÃO ESTÁ AQUI ---
# Copia os arquivos de pacote.
# O caminho de origem DEVE começar com "scraper-shopee/"
COPY scraper-shopee/package.json scraper-shopee/package-lock.json* ./

# Este comando só funciona se o COPY acima for bem-sucedido
RUN npm install --production

# Copia o resto do código do scraper.
# Novamente, o caminho de origem DEVE começar com "scraper-shopee/"
COPY scraper-shopee/. ./
COPY scraper-shopee/.env ./
COPY scraper-shopee/cookies.json ./
# (Se você tiver o.env e cookies.json aqui, também precisam do prefixo)
# COPY scraper-shopee/.env./
# COPY scraper-shopee/cookies.json./

CMD ["node", "scraper.js"]