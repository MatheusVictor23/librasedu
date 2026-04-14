// apps/api/src/controllers/SinalController.js
import SinalService from '../services/SinalService.js';

const getAllSinais = async (req, res) => {
  const { searchTerm } = req.query;
  const userId = req.user?.id;
  try {
    const sinais = searchTerm 
      ? await SinalService.search(searchTerm, userId)
      : await SinalService.getAll(userId);
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais.', details: error.message });
  }
};

const getSinalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const sinal = await SinalService.getById(id, userId);
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

const publishSinal = async (req, res) => {
  try {
    const { id } = req.params;
    const { youtubeUrl } = req.body;

    if (!youtubeUrl || !youtubeUrl.trim()) {
      return res.status(400).json({ error: 'A URL do YouTube é obrigatória.' });
    }

    const newSinal = await SinalService.createFromProposal(id, youtubeUrl);
    res.status(201).json(newSinal);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível publicar o sinal.', details: error.message });
  }
};

const getTrendingSinais = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sinais = await SinalService.getTrending(userId);
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais em alta.', details: error.message });
  }
};

const getRecentSinais = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sinais = await SinalService.getRecent(userId);
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais recentes.', details: error.message });
  }
};

const getRecommendedSinais = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sinais = await SinalService.getRecommended(userId);
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sinais recomendados.', details: error.message });
  }
};

const likeSinal = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const { id: userId } = req.user;
    await SinalService.likeSinal(sinalId, userId);
    res.status(201).json({ message: 'Sinal curtido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível curtir o sinal.', details: error.message });
  }
};

const unlikeSinal = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const { id: userId } = req.user;
    await SinalService.unlikeSinal(sinalId, userId);
    res.status(200).json({ message: 'Curtida removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível remover a curtida.', details: error.message });
  }
};

const saveSinal = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const { id: userId } = req.user;
    await SinalService.saveSinal(sinalId, userId);
    res.status(201).json({ message: 'Sinal guardado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível guardar o sinal.', details: error.message });
  }
};

const unsaveSinal = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const { id: userId } = req.user;
    await SinalService.unsaveSinal(sinalId, userId);
    res.status(200).json({ message: 'Sinal removido dos guardados com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível remover o sinal dos guardados.', details: error.message });
  }
};

const getComentarios = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const comentarios = await SinalService.getComentarios(sinalId);
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários.', details: error.message });
  }
};

const addComentario = async (req, res) => {
  try {
    const { id: sinalId } = req.params;
    const { id: usuarioId } = req.user;
    const { texto } = req.body;

    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'O texto do comentário não pode estar vazio.' });
    }

    const novoComentario = await SinalService.addComentario(sinalId, usuarioId, texto);
    res.status(201).json(novoComentario);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível adicionar o comentário.', details: error.message });
  }
};

const getRecomendacoes = async (req, res) => {
  try {
    const { disciplinaId, sinalIdAtual } = req.params;
    
    const numDisciplinaId = Number(disciplinaId);
    const numSinalIdAtual = Number(sinalIdAtual);

    if (isNaN(numDisciplinaId) || isNaN(numSinalIdAtual)) {
      return res.status(400).json({ message: "IDs inválidos." });
    }

    const recomendacoes = await SinalService.getRecomendacoes(
      numDisciplinaId,
      numSinalIdAtual
    );
    
    res.status(200).json(recomendacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar recomendações.", details: error.message });
  }
};

export default {
  getAllSinais,
  getSinalById,
  createSinal,
  publishSinal,
  getTrendingSinais,
  getRecentSinais,
  getRecommendedSinais,
  likeSinal,
  unlikeSinal,
  saveSinal,
  unsaveSinal,
  getComentarios,
  addComentario,
  getRecomendacoes
};