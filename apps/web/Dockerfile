# apps/web/Dockerfile

# --- MUDANÇA AQUI ---
# Usando a imagem 'slim', que é baseada em Debian e muito mais compatível.
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]