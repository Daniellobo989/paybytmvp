import { Router } from 'express';
import feeController from '../controllers/feeController';

const router = Router();

// Rotas para operações do sistema de taxas
router.get('/platform', feeController.calculatePlatformFee);
router.get('/mining', feeController.estimateOnChainFee);
router.get('/routing', feeController.estimateLightningRoutingFee);
router.post('/record', feeController.recordFeeCollection);
router.get('/report', feeController.generateFeeReport);
router.get('/records', feeController.getAllFeeRecords);
router.get('/records/:feeType', feeController.getFeeRecordsByType);
router.get('/config', feeController.getFeeConfig);
router.put('/config', feeController.updateFeeConfig);

export default router;
