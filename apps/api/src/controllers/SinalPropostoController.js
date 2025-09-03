import SinalPropostoService from '../services/SinalPropostoService.js';
import { Prisma } from '../../generated/prisma/index.js';

const getAllSinaisPropostos = async (req, res) => {
  try {
    const sinaisPropostos = await SinalPropostoService.getAll();
    res.json(sinaisPropostos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar propostas de sinais.', details: error.message });
  }
};

const createSinalProposto = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Não autorizado. O ID do utilizador não foi encontrado na requisição.' });
    }
    
    const proposerId = req.user.id;
    const { nome, descricao, videoUrl, disciplinaId } = req.body;

    if (!nome || !descricao || !videoUrl || !disciplinaId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newSinalProposto = await SinalPropostoService.create({ ...req.body, proposerId });
    res.status(201).json(newSinalProposto);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma proposta de sinal com este nome.' });
    }
    res.status(500).json({ error: 'Não foi possível criar a proposta de sinal.', details: error.message });
  }
};

export default {
  getAllSinaisPropostos,
  createSinalProposto,
};