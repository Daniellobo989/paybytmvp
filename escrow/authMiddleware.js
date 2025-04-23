const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const cryptoUtils = require('../utils/cryptoUtils');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar se o token está no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado, token não fornecido'
      });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuário
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }
      
      // Adicionar usuário à requisição
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido ou expirado'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar 2FA (simplificado para o MVP)
exports.verify2FA = async (req, res, next) => {
  try {
    // Verificar se o usuário tem 2FA habilitado
    if (req.user.two_factor_enabled) {
      const { twoFactorCode } = req.body;
      
      // Verificar se o código foi fornecido
      if (!twoFactorCode) {
        return res.status(400).json({
          success: false,
          error: 'Código 2FA não fornecido'
        });
      }
      
      // Verificar código 2FA (simplificado para o MVP)
      // Em um ambiente de produção, usaríamos uma biblioteca como speakeasy
      if (twoFactorCode !== '123456') { // Código fixo para o MVP
        return res.status(401).json({
          success: false,
          error: 'Código 2FA inválido'
        });
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar se o usuário é vendedor
exports.isSeller = async (req, res, next) => {
  try {
    // Verificar se o usuário é o vendedor do produto
    // Nota: No MVP, qualquer usuário pode ser vendedor
    // Em uma implementação completa, poderíamos ter uma verificação mais robusta
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar se o usuário é comprador
exports.isBuyer = async (req, res, next) => {
  try {
    // Verificar se o usuário é o comprador da transação
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'ID da transação não fornecido'
      });
    }
    
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    if (transaction.buyer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o comprador pode realizar esta ação'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar se o usuário é parte da transação
exports.isTransactionParticipant = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'ID da transação não fornecido'
      });
    }
    
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transação não encontrada'
      });
    }
    
    const userId = req.user._id.toString();
    const isBuyer = transaction.buyer_id.toString() === userId;
    const isSeller = transaction.seller_id.toString() === userId;
    
    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas participantes da transação podem realizar esta ação'
      });
    }
    
    // Adicionar papel do usuário à requisição
    req.userRole = isBuyer ? 'buyer' : 'seller';
    
    next();
  } catch (error) {
    next(error);
  }
};
