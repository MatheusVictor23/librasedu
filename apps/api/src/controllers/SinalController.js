import SinalService from '../services/SinalService.js';

const getAllSinais = async (req, res) => {
  try {
    const sinais = await SinalService.getAll();
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais.', details: error.message });
  }
};

const createSinal = async (req, res) => {
  try {
    const { sinalPropostoId } = req.body;
    if (!sinalPropostoId) {
      return res.status(400).json({ error: 'O campo sinalPropostoId é obrigatório.' });
    }
    const newSinal = await SinalService.createFromProposal({ sinalPropostoId });
    res.status(201).json(newSinal);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o sinal.', details: error.message });
  }
};

export default {
  getAllSinais,
  createSinal,
};