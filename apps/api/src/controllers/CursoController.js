import CursoService from '../services/CursoService.js';

const getAllCursos = async (req, res) => {
  try {
    const cursos = await CursoService.getAll();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cursos.', details: error.message });
  }
};

const createCurso = async (req, res) => {
  try {
    const { nome, areasConhecimentoIds } = req.body;
    if (!nome || !areasConhecimentoIds || !Array.isArray(areasConhecimentoIds) || areasConhecimentoIds.length === 0) {
      return res.status(400).json({ error: 'Os campos nome e areasConhecimentoIds (um array de IDs) são obrigatórios.' });
    }
    const newCurso = await CursoService.create({ nome, areasConhecimentoIds });
    res.status(201).json(newCurso);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o curso.', details: error.message });
  }
};

export default {
  getAllCursos,
  createCurso,
};