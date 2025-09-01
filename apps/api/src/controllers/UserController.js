import UserService from '../services/UserService.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.', details: error.message });
  }
};

const getUserById = async (req, res) => {
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

const createUser = async (req, res) => {
  try {
    // Capturamos os dados, mas ignoramos a 'role' que possa vir do body
    const { idInstituicao, nome, cpf, email, senha } = req.body;

    // Forçamos a role a ser 'USER' para todos os registos públicos
    const newUser = await UserService.create({ 
      idInstituicao, 
      nome, 
      cpf, 
      email, 
      senha, 
      role: 'USER' // <-- ALTERAÇÃO CRUCIAL
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o utilizador.', details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível atualizar o usuário.', details: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Não foi possível deletar o usuário.', details: error.message });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};