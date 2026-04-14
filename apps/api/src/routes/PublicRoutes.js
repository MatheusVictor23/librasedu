import { Router } from 'express';
import { getPublicStats, getPublicRanking } from '../controllers/UserController.js';

const router = Router();

router.get('/public/stats', getPublicStats);
router.get('/public/ranking', getPublicRanking);

export default router;