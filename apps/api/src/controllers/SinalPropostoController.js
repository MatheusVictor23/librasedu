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




const putSinalProposto = async (req, res) => {
  try {
    const { id } = req.params;
    const { avaliadorId, comentariosAvaliador, status } = req.body;

    if (!avaliadorId || !status) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "avaliadorId e status são obrigatórios"
      });
    }

    const resultado = await SinalPropostoService.updateSinalProposto(id, {
      avaliadorId,
      comentariosAvaliador,
      status
    });

    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }

    return res.json(resultado);
  } catch (error) {
    console.error("Erro no controller putSinalProposto:", error);
    return res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor" });
  }
};

export default {
  getAllSinaisPropostos,
  createSinalProposto,
  putSinalProposto
};