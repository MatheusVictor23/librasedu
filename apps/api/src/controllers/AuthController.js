import AuthService from '../services/AuthService.js';

const loginController = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const result = await AuthService.login(email, senha);
    
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default {
  loginController,
};