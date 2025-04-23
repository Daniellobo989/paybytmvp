const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
    unique: true
  },
  opened_by: {
    type: String,
    enum: ['buyer', 'seller', 'platform'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'document', 'text', 'other'],
      default: 'text'
    },
    content: String,
    url: String,
    hash: String,
    submitted_by: {
      type: String,
      enum: ['buyer', 'seller', 'platform'],
      required: true
    },
    submitted_at: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['open', 'under_review', 'resolved', 'closed'],
    default: 'open'
  },
  resolution: {
    decision: {
      type: String,
      enum: ['pending', 'buyer', 'seller', 'split'],
      default: 'pending'
    },
    notes: String,
    resolved_by: {
      type: String,
      enum: ['platform', 'agreement'],
      default: 'platform'
    },
    resolved_at: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o timestamp de atualização
DisputeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Índices para melhorar a performance de busca
DisputeSchema.index({ transaction_id: 1 });
DisputeSchema.index({ status: 1 });
DisputeSchema.index({ opened_by: 1 });
DisputeSchema.index({ created_at: 1 });

module.exports = mongoose.model('Dispute', DisputeSchema);
