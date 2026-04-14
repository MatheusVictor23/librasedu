import SolicitacaoService from '../services/SolicitacaoService.js';

const submitSolicitacaoVinculo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'O documento comprovativo é obrigatório.' });
    }
    const data = {
      ...req.body,
      usuarioId: req.user.id,
      documentoComprovativoUrl: req.file.path,
    };
    const solicitacao = await SolicitacaoService.createSolicitacaoVinculo(data);
    res.status(201).json(solicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível submeter a solicitação de vínculo.', details: error.message });
  }
};

const submitSolicitacaoInstituicao = async (req, res) => {
  try {
    if (!req.files || !req.files.docUsuario || !req.files.docRepresentante) {
      return res.status(400).json({ error: 'Ambos os documentos comprovativos são obrigatórios.' });
    }
    const data = {
      ...req.body,
      usuarioId: req.user.id,
      documentoComprovativoUsuarioUrl: req.files.docUsuario[0].path,
      documentoComprovativoRepresentanteUrl: req.files.docRepresentante[0].path,
    };
    const solicitacao = await SolicitacaoService.createSolicitacaoInstituicao(data);
    res.status(201).json(solicitacao);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível submeter a solicitação de instituição.', details: error.message });
  }
};

const getAllPendingSolicitacoes = async (req, res) => {
  try {
    const solicitacoes = await SolicitacaoService.getAllPending();
    res.json(solicitacoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar solicitações pendentes.', details: error.message });
  }
};

const manageSolicitacaoVinculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, feedback } = req.body;

    if (action === 'approve') {
      await SolicitacaoService.approveSolicitacaoVinculo(id);
      res.status(200).json({ message: 'Solicitação de vínculo aprovada com sucesso.' });
    } else if (action === 'reject') {
      await SolicitacaoService.rejectSolicitacaoVinculo(id, feedback);
      res.status(200).json({ message: 'Solicitação de vínculo rejeitada.' });
    } else {
      res.status(400).json({ error: 'Ação inválida.' });
    }
  } catch (error) {
    // ADICIONADO: Log detalhado do erro no terminal do servidor
    console.error("--- ERRO AO GERIR SOLICITAÇÃO DE VÍNCULO ---");
    console.error(error);
    console.error("-------------------------------------------");
    res.status(500).json({ error: 'Erro ao processar solicitação de vínculo.', details: error.message });
  }
};

const manageSolicitacaoInstituicao = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, feedback } = req.body;

    if (action === 'approve') {
      await SolicitacaoService.approveSolicitacaoInstituicao(id);
      res.status(200).json({ message: 'Solicitação de instituição aprovada com sucesso.' });
    } else if (action === 'reject') {
      await SolicitacaoService.rejectSolicitacaoInstituicao(id, feedback);
      res.status(200).json({ message: 'Solicitação de instituição rejeitada.' });
    } else {
      res.status(400).json({ error: 'Ação inválida.' });
    }
  } catch (error) {
    // ADICIONADO: Log detalhado do erro no terminal do servidor
    console.error("--- ERRO AO GERIR SOLICITAÇÃO DE INSTITUIÇÃO ---");
    console.error(error);
    console.error("---------------------------------------------");
    res.status(500).json({ error: 'Erro ao processar solicitação de instituição.', details: error.message });
  }
};

export default {
  submitSolicitacaoVinculo,
  submitSolicitacaoInstituicao,
  getAllPendingSolicitacoes,
  manageSolicitacaoVinculo,
  manageSolicitacaoInstituicao,
};