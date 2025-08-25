import AreaConhecimentoService from '../services/AreaConhecimentoService.js';

const getAllAreas = async (req, res) => {
  try {
    const areas = await AreaConhecimentoService.getAll();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar áreas de conhecimento.', details: error.message });
  }
};

const createArea = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }
    const newArea = await AreaConhecimentoService.create({ nome });
    res.status(201).json(newArea);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a área de conhecimento.', details: error.message });
  }
};

export default {
  getAllAreas,
  createArea,
};