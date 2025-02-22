FROM node:23-alpine3.19

WORKDIR /app

COPY package*.json  /app/

# Instalar dependências incluindo tsx
RUN npm ci && \
    npm install -g tsx && \
    npm cache clean --force

COPY . .

ENV NODE_ENV production

EXPOSE 8000

# Comando para iniciar a aplicação usando tsx
CMD [ "tsx", "./src/index.ts" ]