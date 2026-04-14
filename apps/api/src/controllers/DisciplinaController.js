// apps/api/src/controllers/DisciplinaController.js
import DisciplinaService from '../services/DisciplinaService.js';
import { Prisma } from '../../generated/prisma/index.js';

// --- Funções Públicas ---

const getAllDisciplinas = async (req, res) => {
  try {
    // Agora busca apenas as disciplinas aprovadas para a lista pública
    const disciplinas = await DisciplinaService.getAllApproved();
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

    // A lógica de criar como PENDENTE ou encontrar existente já está no Service
    const newDisciplina = await DisciplinaService.create(req.body);
    res.status(201).json(newDisciplina);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Este erro é menos provável agora, mas mantido por segurança
        return res.status(409).json({ error: 'Já existe uma disciplina com este nome.' });
    }
    res.status(500).json({ error: 'Não foi possível criar a disciplina.', details: error.message });
  }
};


// --- Funções de Administração ---

const getAllDisciplinasForAdmin = async (req, res) => {
    try {
        const disciplinas = await DisciplinaService.getAllForAdmin();
        res.json(disciplinas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todas as disciplinas para o admin.', details: error.message });
    }
};

const manageDisciplina = async (req, res) => {
    const { id } = req.params;
    const { action, targetId } = req.body; // action pode ser 'approve', 'reject', ou 'merge'

    try {
        if (action === 'approve') {
            const disciplina = await DisciplinaService.approve(id);
            return res.status(200).json({ message: 'Disciplina aprovada com sucesso.', disciplina });
        }
        
        if (action === 'reject') {
            await DisciplinaService.reject(id);
            return res.status(200).json({ message: 'Disciplina rejeitada e excluída com sucesso.' });
        }

        if (action === 'merge') {
            if (!targetId) {
                return res.status(400).json({ error: 'O ID da disciplina de destino (targetId) é obrigatório para mesclar.' });
            }
            await DisciplinaService.merge(id, targetId);
            return res.status(200).json({ message: 'Disciplina mesclada com sucesso.' });
        }

        return res.status(400).json({ error: 'Ação inválida. Use "approve", "reject" ou "merge".' });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerenciar a disciplina.', details: error.message });
    }
};


export default {
  // Públicos
  getAllDisciplinas,
  createDisciplina,
  // Admin
  getAllDisciplinasForAdmin,
  manageDisciplina
};