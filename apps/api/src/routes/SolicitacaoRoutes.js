import { Router } from 'express';
import SolicitacaoController from '../controllers/SolicitacaoController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadDocument } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Rota para solicitar vínculo a uma instituição existente
router.post(
  '/solicitacoes/vinculo',
  protect,
  uploadDocument.single('documento'), // Espera um único arquivo no campo 'documento'
  SolicitacaoController.submitSolicitacaoVinculo
);

// Rota para solicitar cadastro de uma nova instituição
router.post(
  '/solicitacoes/instituicao',
  protect,
  // Espera dois arquivos, um no campo 'docUsuario' e outro em 'docRepresentante'
  uploadDocument.fields([
    { name: 'docUsuario', maxCount: 1 },
    { name: 'docRepresentante', maxCount: 1 },
  ]),
  SolicitacaoController.submitSolicitacaoInstituicao
);

export default router;