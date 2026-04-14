import { Router } from 'express';
import SinalPropostoController from '../controllers/SinalPropostoController.js';
import { protect, hasInstitutionLink } from '../middlewares/authMiddleware.js';
import { uploadVideo } from '../middlewares/uploadMiddleware.js'; 

const router = Router();

router.get('/sinais-propostos', SinalPropostoController.getAllSinaisPropostos);

router.post(
  '/sinais-propostos', 
  protect, 
  hasInstitutionLink, 
  uploadVideo.single('video'), 
  SinalPropostoController.createSinalProposto
);

router.get('/sinais-propostos/:id', protect, SinalPropostoController.getSinalPropostoById);

export default router;