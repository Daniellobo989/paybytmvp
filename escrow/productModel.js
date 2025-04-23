const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['BTC', 'SATS'],
      default: 'SATS'
    }
  },
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  images: [{
    url: String,
    hash: String
  }],
  shipping_options: [{
    method: String,
    price: Number,
    estimated_days: Number
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive', 'blocked'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  ai_verification: {
    is_approved: {
      type: Boolean,
      default: true // Simplificado para o MVP, posteriormente será verificado por IA
    },
    text_analysis: {
      score: Number,
      flags: [String]
    },
    image_analysis: {
      score: Number,
      flags: [String]
    }
  }
});

// Middleware para atualizar o timestamp de atualização
ProductSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Índices para melhorar a performance de busca
ProductSchema.index({ category: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ seller_id: 1 });

module.exports = mongoose.model('Product', ProductSchema);
