#!/bin/bash

# Cores
GREEN="\e[32m"
BLUE="\e[34m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"

echo -e "${BLUE}🚀 Iniciando aplicação...${RESET}"
sudo docker compose up -d --build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Aplicação buildada com sucesso!${RESET}"
else
  echo -e "${RED}❌ Erro ao buildar aplicação!${RESET}"
  exit 1
fi

# 2. Rodar migrations
echo -e "${YELLOW}📦 Executando migrations...${RESET}"
sudo docker compose exec api npx prisma migrate dev --name init
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Migrations executadas com sucesso!${RESET}"
else
  echo -e "${RED}❌ Erro ao executar migrations!${RESET}"
  exit 1
fi

# 3. Popular banco
echo -e "${YELLOW}🌱 Populando banco de dados...${RESET}"
sudo dockercompose exec api npm run seed
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Banco populado com sucesso!${RESET}"
else
  echo -e "${RED}❌ Erro ao popular banco de dados!${RESET}"
  exit 1
fi

echo -e "${GREEN}🎉 Aplicação iniciada com sucesso!${RESET}"
