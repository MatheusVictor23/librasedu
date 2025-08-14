import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/sinais', async (req, res) => {
  try {
    const { nome, descricao, proposal_video_url, proposerId, areaId } = req.body;
    if (!nome || !descricao || !proposal_video_url || !proposerId || !areaId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, descricao, proposal_video_url, proposerId, areaId.' });
    }

    const newSinal = await prisma.sinal.create({
      data: {
        nome,
        descricao,
        proposal_video_url,
        proposerId: parseInt(proposerId),
        areaId: parseInt(areaId),
      },
    });
    res.status(201).json(newSinal);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a proposta de sinal.', details: error.message });
  }
});

router.get('/sinais', async (req, res) => {
  const sinais = await prisma.sinal.findMany({
    include: {
      proposer: true, 
      area: true,     
    },
  });
  res.json(sinais);
});

router.get('/sinais/:id', async (req, res) => {
  const { id } = req.params;
  const sinal = await prisma.sinal.findUnique({
    where: { id: parseInt(id) },
    include: {
      proposer: true,
      area: true,
    },
  });

  if (!sinal) {
    return res.status(404).json({ error: 'Sinal não encontrado.' });
  }

  res.json(sinal);
});

router.put('/sinais/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, status, official_youtube_url } = req.body;
    const updatedSinal = await prisma.sinal.update({
      where: { id: parseInt(id) },
      data: { nome, descricao, status, official_youtube_url },
    });
    res.json(updatedSinal);
  } catch (error) {
    res.status(404).json({ error: 'Sinal não encontrado ou dados inválidos.', details: error.message });
  }
});

router.delete('/sinais/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sinal.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Sinal não encontrado.', details: error.message });
  }
});

export default router;