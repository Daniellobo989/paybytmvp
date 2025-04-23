const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  escrow: {
    multisig_address: {
      type: String,
      required: true
    },
    redeem_script: {
      type: String,
      required: true
    },
    buyer_pubkey: {
      type: String,
      required: true
    },
    seller_pubkey: {
      type: String,
      required: true
    },
    platform_pubkey: {
      type: String,
      required: true
    }
  },
  payment: {
    type: {
      type: String,
      enum: ['on-chain', 'lightning'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    txid: String,
    lightning_invoice: String,
    confirmations: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: [
      'created',
      'awaiting_payment',
      'payment_received',
      'processing',
      'shipped',
      'delivered',
      'completed',
      'disputed',
      'refunded',
      'cancelled'
    ],
    default: 'created'
  },
  shipping: {
    tracking_code: String,
    carrier: String,
    method: String,
    address_hash: String
  },
  timestamps: {
    created: {
      type: Date,
      default: Date.now
    },
    payment_received: Date,
    shipped: Date,
    delivered: Date,
    completed: Date
  },
  dispute: {
    is_active: {
      type: Boolean,
      default: false
    },
    opened_by: {
      type: String,
      enum: ['buyer', 'seller', 'platform']
    },
    reason: String,
    evidence: [{
      type: String
    }],
    resolution: {
      decision: {
        type: String,
        enum: ['pending', 'buyer', 'seller', 'split']
      },
      notes: String,
      timestamp: Date
    }
  }
});

// Índices para melhorar a performance de busca
TransactionSchema.index({ buyer_id: 1 });
TransactionSchema.index({ seller_id: 1 });
TransactionSchema.index({ product_id: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ 'escrow.multisig_address': 1 });
TransactionSchema.index({ 'payment.txid': 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
