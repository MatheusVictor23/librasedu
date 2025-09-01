// src/controllers/AdminController.js
import UserService from '../services/UserService.js';

// Funções para gerir todos os utilizadores
const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar utilizadores.' });
  }
};

// Funções específicas para gerir Avaliadores
const getAllEvaluators = async (req, res) => {
    try {
        const evaluators = await UserService.getAllEvaluators();
        res.json(evaluators);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliadores.' });
    }
};

const createEvaluator = async (req, res) => {
    try {
        // A senha e outros dados vêm do corpo da requisição
        const newEvaluator = await UserService.createEvaluator(req.body);
        res.status(201).json(newEvaluator);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível criar o avaliador.', details: error.message });
    }
};

export default {
  getAllUsers,
  getAllEvaluators,
  createEvaluator,
};