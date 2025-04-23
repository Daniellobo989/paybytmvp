const Message = require('../models/messageModel');
const User = require('../models/userModel');
const cryptoUtils = require('../utils/cryptoUtils');

// Enviar mensagem
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, content, transaction_id } = req.body;
    
    // Validar dados
    if (!receiver_id || !content) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça destinatário e conteúdo da mensagem'
      });
    }
    
    // Verificar se o destinatário existe
    const receiver = await User.findById(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: 'Destinatário não encontrado'
      });
    }
    
    // Gerar ID de conversa
    const conversation_id = cryptoUtils.generateConversationId(
      req.user._id,
      receiver_id
    );
    
    // Criptografar mensagem
    // Nota: Em um ambiente de produção, usaríamos a chave pública real do destinatário
    const encryptedData = cryptoUtils.encryptMessage(
      content,
      receiver.public_key || 'default_public_key'
    );
    
    // Criar mensagem
    const message = await Message.create({
      conversation_id,
      sender_id: req.user._id,
      receiver_id,
      transaction_id: transaction_id || null,
      encrypted_content: encryptedData.encryptedMessage,
      iv: encryptedData.iv,
      encrypted_key: encryptedData.encryptedKey,
      auth_tag: encryptedData.authTag
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: message._id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        transaction_id: message.transaction_id,
        created_at: message.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obter conversas do usuário
exports.getConversations = async (req, res, next) => {
  try {
    // Buscar todas as mensagens onde o usuário é remetente ou destinatário
    const messages = await Message.find({
      $or: [
        { sender_id: req.user._id },
        { receiver_id: req.user._id }
      ]
    })
      .sort({ created_at: -1 })
      .populate('sender_id', 'email_hash')
      .populate('receiver_id', 'email_hash');
    
    // Agrupar mensagens por conversa
    const conversations = {};
    
    messages.forEach(message => {
      if (!conversations[message.conversation_id]) {
        // Determinar o outro participante da conversa
        const otherParticipant = message.sender_id._id.toString() === req.user._id.toString()
          ? message.receiver_id
          : message.sender_id;
        
        conversations[message.conversation_id] = {
          conversation_id: message.conversation_id,
          participant: {
            id: otherParticipant._id,
            email_hash: otherParticipant.email_hash
          },
          last_message: {
            id: message._id,
            sender_id: message.sender_id._id,
            created_at: message.created_at
          },
          unread_count: message.sender_id._id.toString() !== req.user._id.toString() && !message.read ? 1 : 0
        };
      } else if (message.sender_id._id.toString() !== req.user._id.toString() && !message.read) {
        // Incrementar contador de mensagens não lidas
        conversations[message.conversation_id].unread_count += 1;
      }
    });
    
    res.status(200).json({
      success: true,
      count: Object.keys(conversations).length,
      data: Object.values(conversations)
    });
  } catch (error) {
    next(error);
  }
};

// Obter mensagens de uma conversa
exports.getMessages = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Configurar paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Buscar mensagens da conversa
    const messages = await Message.find({ conversation_id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('sender_id', 'email_hash')
      .populate('receiver_id', 'email_hash');
    
    // Verificar se o usuário é parte da conversa
    if (messages.length > 0) {
      const isParticipant = messages.some(message => 
        message.sender_id._id.toString() === req.user._id.toString() ||
        message.receiver_id._id.toString() === req.user._id.toString()
      );
      
      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          error: 'Não autorizado, você não é participante desta conversa'
        });
      }
    }
    
    // Contar total de mensagens
    const total = await Message.countDocuments({ conversation_id });
    
    // Descriptografar mensagens (simplificado para o MVP)
    const decryptedMessages = messages.map(message => {
      // Apenas descriptografar mensagens enviadas para o usuário atual
      if (message.receiver_id._id.toString() === req.user._id.toString()) {
        try {
          const decryptedContent = cryptoUtils.decryptMessage({
            encryptedMessage: message.encrypted_content,
            iv: message.iv,
            encryptedKey: message.encrypted_key,
            authTag: message.auth_tag
          });
          
          return {
            id: message._id,
            conversation_id: message.conversation_id,
            sender_id: message.sender_id._id,
            sender_email_hash: message.sender_id.email_hash,
            receiver_id: message.receiver_id._id,
            receiver_email_hash: message.receiver_id.email_hash,
            content: decryptedContent,
            transaction_id: message.transaction_id,
            attachments: message.attachments,
            read: message.read,
            created_at: message.created_at
          };
        } catch (error) {
          console.error('Erro ao descriptografar mensagem:', error);
          return {
            id: message._id,
            conversation_id: message.conversation_id,
            sender_id: message.sender_id._id,
            sender_email_hash: message.sender_id.email_hash,
            receiver_id: message.receiver_id._id,
            receiver_email_hash: message.receiver_id.email_hash,
            content: '[Mensagem criptografada]',
            transaction_id: message.transaction_id,
            attachments: message.attachments,
            read: message.read,
            created_at: message.created_at
          };
        }
      } else {
        // Para mensagens enviadas pelo usuário atual, retornar o conteúdo original
        return {
          id: message._id,
          conversation_id: message.conversation_id,
          sender_id: message.sender_id._id,
          sender_email_hash: message.sender_id.email_hash,
          receiver_id: message.receiver_id._id,
          receiver_email_hash: message.receiver_id.email_hash,
          content: content, // Conteúdo original da mensagem enviada
          transaction_id: message.transaction_id,
          attachments: message.attachments,
          read: message.read,
          created_at: message.created_at
        };
      }
    });
    
    // Marcar mensagens como lidas
    await Message.updateMany(
      {
        conversation_id,
        receiver_id: req.user._id,
        read: false
      },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      },
      data: decryptedMessages
    });
  } catch (error) {
    next(error);
  }
};

// Marcar mensagem como lida
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar mensagem
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      });
    }
    
    // Verificar se o usuário é o destinatário
    if (message.receiver_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Não autorizado, apenas o destinatário pode marcar a mensagem como lida'
      });
    }
    
    // Marcar como lida
    message.read = true;
    await message.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: message._id,
        read: message.read
      }
    });
  } catch (error) {
    next(error);
  }
};
