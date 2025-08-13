FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --only=production
RUN npm install
RUN npx prisma generate
RUN npm prune --production

FROM node:18-alpine
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]