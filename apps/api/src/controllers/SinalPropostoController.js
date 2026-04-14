import SinalPropostoService from '../services/SinalPropostoService.js';
import { Prisma } from '../../generated/prisma/index.js';

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Não autorizado. O ID do utilizador não foi encontrado na requisição.' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'O arquivo de vídeo é obrigatório.' });
    }

    const proposerId = req.user.id;
    const { nome, descricao, disciplinaId } = req.body;
    const videoBrutoUrl = req.file.path;

    if (!nome || !descricao || !disciplinaId) {
      return res.status(400).json({ error: 'Todos os campos de texto são obrigatórios.' });
    }

    const newSinalProposto = await SinalPropostoService.create({
      nome,
      descricao,
      disciplinaId,
      proposerId,
      videoBrutoUrl
    });

    res.status(201).json(newSinalProposto);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma proposta de sinal com este nome.' });
    }
    res.status(500).json({ error: 'Não foi possível criar a proposta de sinal.', details: error.message });
  }
};

// NOVA FUNÇÃO: Controlador para buscar propostas aprovadas e não publicadas
const getApprovedUnpublishedProposals = async (req, res) => {
  try {
    const proposals = await SinalPropostoService.getApprovedAndUnpublished();
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar propostas aprovadas.', details: error.message });
  }
};

const getSinalPropostoById = async (req, res) => {
    try {
        const { id } = req.params;
        const proposal = await SinalPropostoService.getById(id);

        if (!proposal) {
            return res.status(404).json({ error: 'Proposta de sinal não encontrada.' });
        }

        if (req.user.role !== 'ADMIN' && req.user.role !== 'AVALIADOR' && req.user.id !== proposal.proposerId) {
            return res.status(403).json({ error: 'Acesso não autorizado a esta proposta.' });
        }

        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a proposta de sinal.', details: error.message });
    }
}

export default {
  getAllSinaisPropostos,
  createSinalProposto,
  getSinalPropostoById,
  getApprovedUnpublishedProposals // Exporta a nova função
};