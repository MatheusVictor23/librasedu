import InstituicaoService from '../services/InstituicaoService.js';

const getAllInstituicoes = async (req, res) => {
  try {
    const instituicoes = await InstituicaoService.getAll();
    res.json(instituicoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar instituições.', details: error.message });
  }
};

const createInstituicao = async (req, res) => {
  try {
    const { nome, sigla, cidade, estado, nomeRepresentante, cargoRepresentante } = req.body;
    // ATUALIZAÇÃO: Validar todos os novos campos
    if (!nome || !sigla || !cidade || !estado || !nomeRepresentante || !cargoRepresentante) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    const newInstituicao = await InstituicaoService.create(req.body);
    res.status(201).json(newInstituicao);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar a instituição.', details: error.message });
  }
};

const updateInstituicao = async (req, res) => {
    try {
        const updatedInstituicao = await InstituicaoService.update(req.params.id, req.body);
        res.json(updatedInstituicao);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível atualizar a instituição.', details: error.message });
    }
};

// NOVO CONTROLADOR: Remover instituição
const deleteInstituicao = async (req, res) => {
    try {
        await InstituicaoService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível remover a instituição.', details: error.message });
    }
};


export default {
  getAllInstituicoes,
  createInstituicao,
  updateInstituicao, // Exportar
  deleteInstituicao, // Exportar
};