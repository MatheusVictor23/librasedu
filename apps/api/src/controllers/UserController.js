import UserService from '../services/UserService.js';
import InstituicaoService from '../services/InstituicaoService.js';
import SinalPropostoService from '../services/SinalPropostoService.js';
import SinalService from '../services/SinalService.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await UserService.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { idInstituicao, nome, cpf, email, senha, role } = req.body;
        const avatarUrl = req.file ? req.file.path : null; 
        const newUser = await UserService.create({ idInstituicao, nome, cpf, email, senha, role, avatarUrl });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível criar o utilizador.', details: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserService.update(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível atualizar o usuário.', details: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.avatarUrl = req.file.path;
        }
        const updatedUser = await UserService.updateProfile(req.user.id, data);
        const { senha: _, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível atualizar o perfil.', details: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const userProfile = await UserService.getProfileById(req.user.id);
        if (!userProfile) {
            return res.status(404).json({ error: 'Perfil do utilizador não encontrado.' });
        }
        const { senha: _, ...userWithoutPassword } = userProfile;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o perfil do utilizador.', details: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await UserService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Não foi possível deletar o usuário.', details: error.message });
    }
};

export const getAllEvaluators = async (req, res) => {
    try {
        const evaluators = await UserService.getAllEvaluators();
        res.json(evaluators);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliadores.', details: error.message });
    }
};

export const createEvaluator = async (req, res) => {
    try {
        const newEvaluator = await UserService.createEvaluator(req.body);
        const { senha: _, ...evaluatorWithoutPassword } = newEvaluator;
        res.status(201).json(evaluatorWithoutPassword);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível criar o avaliador.', details: error.message });
    }
};

export const getAllInstituicoes = async (req, res) => {
    try {
        const instituicoes = await InstituicaoService.getAll();
        res.json(instituicoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar instituições.', details: error.message });
    }
};

export const getAllSinaisPropostos = async (req, res) => {
  try {
    const propostos = await SinalPropostoService.getPendingProposals();
    res.json(propostos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar propostas de sinais.', details: error.message });
  }
};

export const getAllSinaisOficiais = async (req, res) => {
    try {
        const sinais = await SinalService.getAll();
        res.json(sinais);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar sinais oficiais.', details: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await UserService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard.', details: error.message });
    }
};

export const getRecentUsers = async (req, res) => {
    try {
        const users = await UserService.getRecentUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar utilizadores recentes.', details: error.message });
    }
};

export const getProposalsByDay = async (req, res) => {
    try {
        const data = await SinalPropostoService.getProposalsByDay();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados para o gráfico.', details: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const data = await UserService.getUsersByRole();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados de perfil dos utilizadores.', details: error.message });
    }
};

export const getMyStats = async (req, res) => {
    try {
        const stats = await UserService.getUserStats(req.user.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas do usuário.', details: error.message });
    }
};

export const getMyFavoritedSinais = async (req, res) => {
    try {
        const sinais = await UserService.getFavoritedSinais(req.user.id);
        res.json(sinais);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar sinais favoritados.', details: error.message });
    }
};

export const getMySubmittedProposals = async (req, res) => {
    try {
        const proposals = await UserService.getSubmittedProposals(req.user.id);
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar propostas submetidas.', details: error.message });
    }
};