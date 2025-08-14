import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import areaRoutes from './src/routes/areaRoutes.js';
import sinalRoutes from './src/routes/sinalRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors()); 


app.use('/api', userRoutes);
app.use('/api', areaRoutes); 
app.use('/api', sinalRoutes); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor da API rodando na porta ${PORT}`);
  console.log(`Ambiente de desenvolvimento ativo em Manaus.`);
});