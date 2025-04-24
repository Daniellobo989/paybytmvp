import { Router } from 'express';
import oracleController from '../controllers/oracleController';

const router = Router();

// Rotas para operações do sistema de oráculos
router.post('/tracking', oracleController.registerTrackingCode);
router.get('/tracking/:trackingCode', oracleController.getDeliveryStatus);
router.get('/tracking/:trackingCode/status', oracleController.checkTrackingStatus);
router.get('/tracking/:trackingCode/qrcode', oracleController.generateDeliveryQRCode);
router.post('/tracking/confirm', oracleController.processQRCodeConfirmation);

router.post('/digital', oracleController.registerDigitalDelivery);
router.get('/digital/:productId', oracleController.getDigitalDeliveryStatus);
router.post('/digital/:productId/confirm', oracleController.confirmDigitalDelivery);
router.post('/digital/proof', oracleController.registerOpeningProof);
router.post('/digital/verify', oracleController.verifyReadingProof);

export default router;
