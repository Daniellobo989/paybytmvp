import { Router } from 'express';
import feeDistributionController from '../controllers/feeDistributionController';

const router = Router();

// Rotas para operações do sistema de distribuição de taxas
router.post('/distribute', feeDistributionController.distributeFee);
router.get('/config', feeDistributionController.getDistributionConfig);
router.put('/config', feeDistributionController.updateDistributionConfig);
router.get('/records', feeDistributionController.getAllDistributionRecords);
router.get('/records/period', feeDistributionController.getDistributionRecordsByPeriod);
router.get('/report', feeDistributionController.generateDistributionReport);

export default router;
