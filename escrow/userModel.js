const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email_hash: {
    type: String,
    required: true,
    unique: true
  },
  public_key: {
    type: String,
    required: false
  },
  two_factor_secret: {
    type: String,
    required: false
  },
  two_factor_enabled: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  reputation: {
    rating: {
      type: Number,
      default: 0
    },
    total_transactions: {
      type: Number,
      default: 0
    },
    completed_transactions: {
      type: Number,
      default: 0
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date
  },
  settings: {
    preferred_payment: {
      type: String,
      enum: ['on-chain', 'lightning'],
      default: 'on-chain'
    },
    notification_preferences: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    }
  }
});

// Método para criptografar email
UserSchema.statics.hashEmail = function(email) {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
};

// Método para verificar senha
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware para criptografar senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
