import { Router } from 'express';
import SinalPropostoService from '../services/SinalPropostoService.js';
import { protect, isEvaluator } from '../middlewares/authMiddleware.js';

const router = Router();
router.use('/evaluator', protect, isEvaluator);

router.get('/evaluator/proposals/pending', async (req, res) => {
    try {
        const proposals = await SinalPropostoService.getPendingProposals();
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar propostas pendentes.' });
    }
});

router.post('/evaluator/proposals/:id/evaluate', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comentarios } = req.body;
        const evaluatorId = req.user.id; 

        if (!status || (status !== 'APROVADO' && status !== 'REJEITADO')) {
            return res.status(400).json({ error: 'O campo status (APROVADO ou REJEITADO) é obrigatório.' });
        }

        const result = await SinalPropostoService.submitEvaluation(id, evaluatorId, status, comentarios);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: 'Não foi possível submeter a avaliação.', details: error.message });
    }
});

router.get('/evaluator/proposals/:status', async (req, res) => {
    try {
        const { status } = req.params;
        if (status.toUpperCase() !== 'APROVADO' && status.toUpperCase() !== 'REJEITADO') {
            return res.status(400).json({ error: 'Status inválido. Use "aprovado" ou "rejeitado".' });
        }
        const proposals = await SinalPropostoService.getProposalsByStatus(status.toUpperCase());
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: `Erro ao buscar propostas com status ${req.params.status}.` });
    }
});

export default router;