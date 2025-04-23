const User = require('../models/userModel');
const cryptoUtils = require('../utils/cryptoUtils');

// Registrar novo usuário
exports.register = async (req, res, next) => {
  try {
    const { email, password, public_key } = req.body;
    
    // Validar dados
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça email e senha'
      });
    }
    
    // Verificar se o email já está em uso
    const emailHash = User.hashEmail(email);
    const existingUser = await User.findOne({ email_hash: emailHash });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já está em uso'
      });
    }
    
    // Criar novo usuário
    const user = await User.create({
      email_hash: emailHash,
      password,
      public_key: public_key || ''
    });
    
    // Gerar token JWT
    const token = cryptoUtils.generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email_hash: user.email_hash,
        public_key: user.public_key,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuário
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar dados
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça email e senha'
      });
    }
    
    // Buscar usuário pelo email hash
    const emailHash = User.hashEmail(email);
    const user = await User.findOne({ email_hash: emailHash }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
    
    // Verificar senha
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
    
    // Atualizar último login
    user.last_login = Date.now();
    await user.save();
    
    // Gerar token JWT
    const token = cryptoUtils.generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email_hash: user.email_hash,
        public_key: user.public_key,
        created_at: user.created_at,
        last_login: user.last_login
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email_hash: user.email_hash,
        public_key: user.public_key,
        reputation: user.reputation,
        created_at: user.created_at,
        last_login: user.last_login,
        settings: user.settings,
        two_factor_enabled: user.two_factor_enabled
      }
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res, next) => {
  try {
    const { public_key, settings } = req.body;
    
    // Buscar usuário
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Atualizar campos
    if (public_key) user.public_key = public_key;
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email_hash: user.email_hash,
        public_key: user.public_key,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Configurar 2FA (simplificado para o MVP)
exports.setup2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Gerar segredo 2FA (simplificado para o MVP)
    const twoFactorSecret = 'ABCDEFGHIJKLMNOP'; // Em produção, usaríamos speakeasy.generateSecret()
    
    // Atualizar usuário
    user.two_factor_secret = twoFactorSecret;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        secret: twoFactorSecret,
        qrCode: `otpauth://totp/PayByt:${user.email_hash}?secret=${twoFactorSecret}&issuer=PayByt`
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verificar e ativar 2FA
exports.verify2FASetup = async (req, res, next) => {
  try {
    const { twoFactorCode } = req.body;
    
    if (!twoFactorCode) {
      return res.status(400).json({
        success: false,
        error: 'Código 2FA não fornecido'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Verificar código 2FA (simplificado para o MVP)
    // Em produção, usaríamos speakeasy.totp.verify()
    const isValid = twoFactorCode === '123456'; // Código fixo para o MVP
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Código 2FA inválido'
      });
    }
    
    // Ativar 2FA
    user.two_factor_enabled = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Autenticação de dois fatores ativada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Obter reputação de um usuário
exports.getUserReputation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user_id: user._id,
        reputation: user.reputation
      }
    });
  } catch (error) {
    next(error);
  }
};
