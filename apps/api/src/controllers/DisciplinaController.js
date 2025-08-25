import DisciplinaService from '../services/DisciplinaService.js';

const getAllDisciplinas = async (req, res) => {
  try {
    const disciplinas = await DisciplinaService.getAll();
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar disciplinas.', details: error.message });
  }
};

const createDisciplina = async (req, res) => {
  try {
    const { nome, cargaHoraria, idCurso } = req.body;
    if (!nome || !cargaHoraria || !idCurso) {
      return res.status(400).json({ error: 'Os campos nome, cargaHoraria e idCurso são obrigatórios.' });
    }
    const newDisciplina = await DisciplinaService.create({ nome, cargaHoraria, idCurso });
    res.status(201).json(newDisciplina);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a disciplina.', details: error.message });
  }
};

export default {
  getAllDisciplinas,
  createDisciplina,
};