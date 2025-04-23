const express = require('express');
const router = express.Router();
const bitcoinService = require('../services/bitcoinService');
const lightningService = require('../services/lightningService');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas protegidas
router.use(authMiddleware.protect);

// Rotas de pagamento Bitcoin
router.post('/bitcoin/address', async (req, res, next) => {
  try {
    const { buyer_pubkey, seller_pubkey } = req.body;
    
    if (!buyer_pubkey || !seller_pubkey) {
      return res.status(400).json({
        success: false,
        error: 'Chaves públicas do comprador e vendedor são necessárias'
      });
    }
    
    const multisigData = bitcoinService.createMultisigAddress(buyer_pubkey, seller_pubkey);
    
    res.status(200).json({
      success: true,
      data: multisigData
    });
  } catch (error) {
    next(error);
  }
});

router.get('/bitcoin/address/:address/balance', async (req, res, next) => {
  try {
    const { address } = req.params;
    
    const balance = await bitcoinService.getAddressBalance(address);
    
    res.status(200).json({
      success: true,
      data: balance
    });
  } catch (error) {
    next(error);
  }
});

router.get('/bitcoin/transaction/:txid', async (req, res, next) => {
  try {
    const { txid } = req.params;
    
    const transaction = await bitcoinService.checkTransactionStatus(txid);
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
});

// Rotas de pagamento Lightning
router.post('/lightning/invoice', async (req, res, next) => {
  try {
    const { amount, description, expiry } = req.body;
    
    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        error: 'Valor e descrição são necessários'
      });
    }
    
    const invoice = await lightningService.createInvoice(
      amount,
      description,
      expiry
    );
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
});

router.get('/lightning/invoice/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const paymentStatus = await lightningService.checkPayment(id);
    
    res.status(200).json({
      success: true,
      data: paymentStatus
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
