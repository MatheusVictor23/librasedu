import DisciplinaService from '../services/DisciplinaService.js';
import { Prisma } from '../../generated/prisma/index.js'; // Importar o Prisma

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
    const { nome } = req.body;
    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }
    const newDisciplina = await DisciplinaService.create(req.body);
    res.status(201).json(newDisciplina);
  } catch (error) {
    // Bloco de erro mais detalhado
    console.error("Erro ao criar disciplina:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ 
        error: 'Erro de banco de dados ao criar disciplina.', 
        details: error.message, 
        code: error.code 
      });
    }
    res.status(500).json({ error: 'Não foi possível criar a disciplina.', details: error.message });
  }
};

export default {
  getAllDisciplinas,
  createDisciplina,
};