import InstituicaoService from '../services/InstituicaoService.js';

const getAllInstituicoes = async (req, res) => {
  try {
    const instituicoes = await InstituicaoService.getAll();
    res.json(instituicoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar instituições.', details: error.message });
  }
};

const createInstituicao = async (req, res) => {
  try {
    const { nome, sigla } = req.body;
    if (!nome || !sigla) {
      return res.status(400).json({ error: 'Os campos nome e sigla são obrigatórios.' });
    }
    const newInstituicao = await InstituicaoService.create({ nome, sigla });
    res.status(201).json(newInstituicao);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a instituição.', details: error.message });
  }
};

export default {
  getAllInstituicoes,
  createInstituicao,
};