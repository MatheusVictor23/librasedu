import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/users', async (req, res) => {
  try {
    const { email, nome } = req.body;
    const newUser = await prisma.usuario.create({
      data: {
        email,
        nome,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o usuário.', details: error.message });
  }
});

router.get('/users', async (req, res) => {
  const users = await prisma.usuario.findMany();
  res.json(users);
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.usuario.findUnique({
    where: { id: parseInt(id) },
  });
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.json(user);
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nome } = req.body;
    const updatedUser = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { email, nome },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado ou dados inválidos.', details: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado.', details: error.message });
  }
});

export default router;