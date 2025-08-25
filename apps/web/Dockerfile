# apps/web/Dockerfile
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Agora o CMD apenas executa o nosso script 'dev'
CMD ["npm", "run", "dev"]