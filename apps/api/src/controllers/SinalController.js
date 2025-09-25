import SinalService from '../services/SinalService.js';

const getAllSinais = async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const sinais = searchTerm 
      ? await SinalService.search(searchTerm)
      : await SinalService.getAll();
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais.', details: error.message });
  }
};

/**
 * NOVO: Controlador para buscar um sinal pelo ID.
 * Lida com a requisição, chama o serviço e retorna a resposta ou um erro.
 */
const getSinalById = async (req, res) => {
  try {
    const { id } = req.params;
    const sinal = await SinalService.getById(id);
    res.status(200).json(sinal);
  } catch (error) {
    if (error.message === 'Sinal não encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao buscar o sinal.', details: error.message });
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

const getTrendingSinais = async (req, res) => {
  try {
    const sinais = await SinalService.getTrending();
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais em alta.', details: error.message });
  }
};

const getRecentSinais = async (req, res) => {
  try {
    const sinais = await SinalService.getRecent();
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais recentes.', details: error.message });
  }
};

const getRecommendedSinais = async (req, res) => {
  try {
    const sinais = await SinalService.getRecommended();
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais recomendados.', details: error.message });
  }
};


export default {
  getAllSinais,
  getSinalById, // Exporta o novo controlador
  createSinal,
  getTrendingSinais,
  getRecentSinais,
  getRecommendedSinais
};