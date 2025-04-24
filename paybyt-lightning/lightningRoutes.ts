import { Router } from 'express';
import lightningController from '../controllers/lightningController';

const router = Router();

// Rotas para operações Lightning Network
router.post('/invoice', lightningController.createInvoice);
router.get('/invoice/:invoiceId', lightningController.getInvoice);
router.get('/invoice/:invoiceId/status', lightningController.checkInvoiceStatus);
router.get('/invoices', lightningController.getAllInvoices);
router.post('/webhook/btcpay', lightningController.processBTCPayWebhook);
router.post('/webhook/opennode', lightningController.processOpenNodeWebhook);
router.get('/fee-estimate', lightningController.estimateFees);

export default router;
