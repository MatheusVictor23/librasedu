FROM node:18-alpine AS deps

RUN apk add --no-cache openssl

WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma

COPY . .

EXPOSE 3000