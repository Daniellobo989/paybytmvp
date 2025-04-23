const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas protegidas
router.use(authMiddleware.protect);

// Rotas de transações
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.get('/:id/check-payment', transactionController.checkPayment);
router.post('/:id/shipping', transactionController.confirmShipping);
router.post('/:id/delivery', transactionController.confirmDelivery);
router.post('/:id/release', transactionController.releaseFunds);
router.post('/:id/dispute', transactionController.openDispute);
router.post('/:id/resolve', transactionController.resolveDispute);

module.exports = router;
