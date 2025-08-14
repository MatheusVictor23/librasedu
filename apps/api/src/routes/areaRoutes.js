import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/areas', async (req, res) => {
  try {
    const { nome } = req.body;
    const newArea = await prisma.areaDeConhecimento.create({
      data: { nome },
    });
    res.status(201).json(newArea);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a área de conhecimento.', details: error.message });
  }
});

router.get('/areas', async (req, res) => {
  const areas = await prisma.areaDeConhecimento.findMany();
  res.json(areas);
});

router.get('/areas/:id', async (req, res) => {
  const { id } = req.params;
  const area = await prisma.areaDeConhecimento.findUnique({
    where: { id: parseInt(id) },
  });

  if (!area) {
    return res.status(404).json({ error: 'Área de conhecimento não encontrada.' });
  }

  res.json(area);
});

router.put('/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const updatedArea = await prisma.areaDeConhecimento.update({
      where: { id: parseInt(id) },
      data: { nome },
    });
    res.json(updatedArea);
  } catch (error) {
    res.status(404).json({ error: 'Área de conhecimento não encontrada ou dados inválidos.', details: error.message });
  }
});

router.delete('/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.areaDeConhecimento.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Área de conhecimento não encontrada.', details: error.message });
  }
});

export default router;