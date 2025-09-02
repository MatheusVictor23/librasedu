// apps/api/server.js
import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});

// ADICIONE ESTE BLOCO DE CÓDIGO NO FINAL DO FICHEIRO
// -----------------------------------------------------
// Safety net para capturar erros não tratados
process.on('unhandledRejection', (reason, promise) => {
  console.error('ERRO NÃO TRATADO (Promise Rejection):', promise, 'MOTIVO:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('ERRO CRÍTICO (Uncaught Exception):', err);
  // Em produção, o ideal seria sair de forma controlada, mas para depuração vamos apenas logar.
});
// -----------------------------------------------------