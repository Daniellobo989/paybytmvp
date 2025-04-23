const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation_id: {
    type: String,
    required: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  encrypted_content: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  encrypted_key: {
    type: String,
    required: true
  },
  auth_tag: {
    type: String,
    required: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'other'],
      default: 'other'
    },
    encrypted_url: String,
    hash: String
  }],
  read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhorar a performance de busca
MessageSchema.index({ conversation_id: 1 });
MessageSchema.index({ sender_id: 1, receiver_id: 1 });
MessageSchema.index({ transaction_id: 1 });
MessageSchema.index({ created_at: 1 });

module.exports = mongoose.model('Message', MessageSchema);
