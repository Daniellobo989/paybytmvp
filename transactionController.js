const Transaction = require('../models/transactionModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const escrowService = require('../services/escrowService');

// Criar nova transação
exports.createTransaction = async (req, res, next) => {
  try {
    const { product_id, payment_type = 'on-chain' } = req.body;
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'ID do produto não fornecido'
      });
    }
    
    // Verificar se o tipo de pagamento é válido
    if (!['on-chain', 'lightning'].includes(payment_type)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de pagamento inválido'
      });
    }
    
    // Criar transação com escrow
    const transaction = await escrowService.createEscrow(
      req.user._id,
      product_id,
      payment_type
    );
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Obter todas as transações do usuário
exports.getTransactions = async (req, res, next) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;
    
    // Construir filtro
    const filter = {};
    
    // Filtrar por papel (comprador ou vendedor)
    if (role === 'buyer') {
      filter.buyer_id = req.user._id;
    } else if (role === 'seller') {
      filter.seller_id = req.user._id;
    } else {
      // Se não especificado, buscar todas as transações do usuário
      filter.$or = [
        { buyer_id: req.user._id },
        { seller_id: req.user._id }
      ];
    }
    
    // Filtrar por status
    if (status) {
      filter.status = status;
    }
    
    // Configurar paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Buscar transações
    const transactions = await Transaction.find(filter)
      .sort({ 'timestamps.created': -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('buyer_id', 'email_hash reputation')
      .populate('seller_id', 'email_hash reputation')
      .populate('product_id', 'title price images');
    
    // Contar total de transações
    const total = await Transaction.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      },
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Obter transação por ID
exports.getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate('buyer_id', 'email_hash reputation')
      .populate('seller_id', 'email_hash reputation')
      .populate('product_id');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Verificar se o usuário é parte da transação
    const userId = req.user._id.toString();
    const isBuyer = transaction.buyer_id._id.toString() === userId;
    const isSeller = transaction.seller_id._id.toString() === userId;
    
    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas participantes da transação podem visualizá-la'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Verificar pagamento
exports.checkPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await escrowService.checkPayment(id);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Confirmar envio do produto (vendedor)
exports.confirmShipping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tracking_code, carrier, method } = req.body;
    
    // Validar dados
    if (!tracking_code || !carrier) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça código de rastreamento e transportadora'
      });
    }
    
    // Buscar transação
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Verificar se o usuário é o vendedor
    if (transaction.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o vendedor pode confirmar o envio'
      });
    }
    
    // Confirmar envio
    const result = await escrowService.confirmShipping(id, {
      tracking_code,
      carrier,
      method: method || 'standard'
    });
    
    res.status(200).json({
      success: true,
      data: result.transaction
    });
  } catch (error) {
    next(error);
  }
};

// Confirmar recebimento do produto (comprador)
exports.confirmDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar transação
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Verificar se o usuário é o comprador
    if (transaction.buyer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o comprador pode confirmar o recebimento'
      });
    }
    
    // Confirmar recebimento
    const result = await escrowService.confirmDelivery(id);
    
    res.status(200).json({
      success: true,
      data: result.transaction
    });
  } catch (error) {
    next(error);
  }
};

// Liberar fundos do escrow
exports.releaseFunds = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar transação
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Verificar se o usuário é o comprador
    if (transaction.buyer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o comprador pode liberar os fundos'
      });
    }
    
    // Liberar fundos
    const result = await escrowService.releaseFunds(id);
    
    res.status(200).json({
      success: true,
      data: result.transaction
    });
  } catch (error) {
    next(error);
  }
};

// Abrir disputa
exports.openDispute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, description, evidence } = req.body;
    
    // Validar dados
    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça motivo e descrição da disputa'
      });
    }
    
    // Buscar transação
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    // Verificar se o usuário é parte da transação
    const userId = req.user._id.toString();
    const isBuyer = transaction.buyer_id.toString() === userId;
    const isSeller = transaction.seller_id.toString() === userId;
    
    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas participantes da transação podem abrir disputa'
      });
    }
    
    // Abrir disputa
    const result = await escrowService.openDispute(id, {
      opened_by: isBuyer ? 'buyer' : 'seller',
      reason,
      evidence: evidence || []
    });
    
    res.status(200).json({
      success: true,
      data: result.transaction
    });
  } catch (error) {
    next(error);
  }
};

// Resolver disputa (simplificado para o MVP - apenas plataforma)
exports.resolveDispute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;
    
    // Validar dados
    if (!decision) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça a decisão da disputa'
      });
    }
    
    // Verificar se a decisão é válida
    if (!['buyer', 'seller', 'split'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: 'Decisão inválida'
      });
    }
    
    // Nota: Em um ambiente de produção, verificaríamos se o usuário é um administrador
    // Para o MVP, qualquer usuário pode resolver disputas (simplificado)
    
    // Resolver disputa
    const result = await escrowService.resolveDispute(id, {
      decision,
      notes: notes || ''
    });
    
    res.status(200).json({
      success: true,
      data: result.transaction
    });
  } catch (error) {
    next(error);
  }
};
