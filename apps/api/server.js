import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import path from 'path'; // 1. Importar o módulo 'path'
import { fileURLToPath } from 'url'; // 1. Importar 'fileURLToPath'

const __filename = fileURLToPath(import.meta.url); // 2. Obter o caminho do arquivo atual
const __dirname = path.dirname(__filename); // 2. Obter o diretório do arquivo atual

const app = express();

app.use(express.json());
app.use(cors());

// 3. Servir os arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('ERRO NÃO TRATADO (Promise Rejection):', promise, 'MOTIVO:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('ERRO CRÍTICO (Uncaught Exception):', err);
});