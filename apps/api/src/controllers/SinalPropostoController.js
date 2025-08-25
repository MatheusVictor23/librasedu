import SinalPropostoService from '../services/SinalPropostoService.js';

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
    const { nome, descricao, videoUrl, disciplinaId, proposerId } = req.body;
    if (!nome || !descricao || !videoUrl || !disciplinaId || !proposerId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, descricao, videoUrl, disciplinaId, proposerId.' });
    }
    const newSinalProposto = await SinalPropostoService.create(req.body);
    res.status(201).json(newSinalProposto);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a proposta de sinal.', details: error.message });
  }
};

export default {
  getAllSinaisPropostos,
  createSinalProposto,
};