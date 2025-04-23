const Transaction = require('../models/transactionModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const bitcoinService = require('../services/bitcoinService');
const lightningService = require('../services/lightningService');

// Serviço para gerenciar o escrow multisig
class EscrowService {
  // Criar nova transação com escrow
  async createEscrow(buyerId, productId, paymentType = 'on-chain') {
    try {
      // Buscar produto
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      // Verificar se produto está disponível
      if (product.status !== 'active') {
        throw new Error('Produto não está disponível para compra');
      }
      
      // Buscar comprador e vendedor
      const buyer = await User.findById(buyerId);
      const seller = await User.findById(product.seller_id);
      
      if (!buyer || !seller) {
        throw new Error('Comprador ou vendedor não encontrado');
      }
      
      // Verificar se comprador tem chave pública
      if (!buyer.public_key) {
        throw new Error('Comprador não possui chave pública registrada');
      }
      
      // Verificar se vendedor tem chave pública
      if (!seller.public_key) {
        throw new Error('Vendedor não possui chave pública registrada');
      }
      
      // Criar endereço multisig
      const escrowData = bitcoinService.createMultisigAddress(
        buyer.public_key,
        seller.public_key
      );
      
      // Calcular taxa de transação (simplificado para o MVP)
      const fee = Math.ceil(product.price.amount * 0.01); // 1% de taxa
      
      // Criar transação
      const transaction = new Transaction({
        buyer_id: buyerId,
        seller_id: product.seller_id,
        product_id: productId,
        escrow: {
          multisig_address: escrowData.address,
          redeem_script: escrowData.redeemScript,
          buyer_pubkey: escrowData.buyerPubKey,
          seller_pubkey: escrowData.sellerPubKey,
          platform_pubkey: escrowData.platformPubKey
        },
        payment: {
          type: paymentType,
          amount: product.price.amount,
          fee: fee
        },
        status: 'created'
      });
      
      await transaction.save();
      
      // Se for pagamento Lightning, gerar fatura
      if (paymentType === 'lightning') {
        const invoice = await lightningService.createInvoice(
          product.price.amount,
          `Pagamento para ${product.title}`
        );
        
        transaction.payment.lightning_invoice = invoice.paymentRequest;
        await transaction.save();
      }
      
      // Atualizar status do produto
      product.status = 'sold';
      await product.save();
      
      return transaction;
    } catch (error) {
      console.error('Erro ao criar escrow:', error);
      throw error;
    }
  }
  
  // Verificar pagamento
  async checkPayment(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      if (transaction.payment.type === 'on-chain') {
        // Verificar saldo do endereço multisig
        const balance = await bitcoinService.getAddressBalance(transaction.escrow.multisig_address);
        
        // Verificar se o valor recebido é suficiente
        if (balance.total >= transaction.payment.amount) {
          // Atualizar status da transação
          transaction.status = 'payment_received';
          transaction.timestamps.payment_received = Date.now();
          
          // Salvar TXID (simplificado para o MVP)
          // Em um ambiente real, precisaríamos monitorar a blockchain para obter o TXID
          transaction.payment.txid = 'txid_placeholder';
          
          await transaction.save();
          return { success: true, status: 'payment_received', balance };
        }
        
        return { success: false, status: 'awaiting_payment', balance };
      } else if (transaction.payment.type === 'lightning') {
        // Verificar pagamento Lightning
        const paymentStatus = await lightningService.checkPayment(transaction.payment.lightning_invoice);
        
        if (paymentStatus.isPaid) {
          // Atualizar status da transação
          transaction.status = 'payment_received';
          transaction.timestamps.payment_received = Date.now();
          await transaction.save();
          
          return { success: true, status: 'payment_received', paymentStatus };
        }
        
        return { success: false, status: 'awaiting_payment', paymentStatus };
      }
      
      return { success: false, status: 'unknown_payment_type' };
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      throw error;
    }
  }
  
  // Confirmar envio do produto
  async confirmShipping(transactionId, trackingInfo) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      // Verificar se o pagamento foi recebido
      if (transaction.status !== 'payment_received') {
        throw new Error('Pagamento ainda não foi recebido');
      }
      
      // Atualizar status e informações de envio
      transaction.status = 'shipped';
      transaction.timestamps.shipped = Date.now();
      transaction.shipping = {
        ...transaction.shipping,
        ...trackingInfo
      };
      
      await transaction.save();
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Erro ao confirmar envio:', error);
      throw error;
    }
  }
  
  // Confirmar recebimento do produto
  async confirmDelivery(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      // Verificar se o produto foi enviado
      if (transaction.status !== 'shipped') {
        throw new Error('Produto ainda não foi enviado');
      }
      
      // Atualizar status
      transaction.status = 'delivered';
      transaction.timestamps.delivered = Date.now();
      
      await transaction.save();
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      throw error;
    }
  }
  
  // Liberar fundos do escrow (simplificado para o MVP)
  async releaseFunds(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      // Verificar se o produto foi entregue
      if (transaction.status !== 'delivered') {
        throw new Error('Produto ainda não foi entregue');
      }
      
      // Nota: Esta é uma implementação simplificada para o MVP
      // Em um ambiente de produção, precisaríamos implementar a lógica completa
      // de assinatura multisig e transmissão da transação
      
      // Simular liberação de fundos
      transaction.status = 'completed';
      transaction.timestamps.completed = Date.now();
      
      await transaction.save();
      
      // Atualizar reputação do vendedor
      const seller = await User.findById(transaction.seller_id);
      if (seller) {
        seller.reputation.total_transactions += 1;
        seller.reputation.completed_transactions += 1;
        // Calcular nova classificação média (simplificado)
        seller.reputation.rating = (seller.reputation.rating * (seller.reputation.completed_transactions - 1) + 5) / seller.reputation.completed_transactions;
        await seller.save();
      }
      
      // Atualizar reputação do comprador
      const buyer = await User.findById(transaction.buyer_id);
      if (buyer) {
        buyer.reputation.total_transactions += 1;
        buyer.reputation.completed_transactions += 1;
        await buyer.save();
      }
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Erro ao liberar fundos:', error);
      throw error;
    }
  }
  
  // Abrir disputa
  async openDispute(transactionId, disputeData) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      // Verificar se a transação está em um estado válido para disputa
      const validStates = ['payment_received', 'processing', 'shipped', 'delivered'];
      if (!validStates.includes(transaction.status)) {
        throw new Error('Transação não está em um estado válido para abrir disputa');
      }
      
      // Atualizar status da transação
      transaction.status = 'disputed';
      transaction.dispute = {
        is_active: true,
        opened_by: disputeData.opened_by,
        reason: disputeData.reason,
        evidence: disputeData.evidence || []
      };
      
      await transaction.save();
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Erro ao abrir disputa:', error);
      throw error;
    }
  }
  
  // Resolver disputa (simplificado para o MVP)
  async resolveDispute(transactionId, resolution) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transação não encontrada');
      }
      
      // Verificar se a transação está em disputa
      if (transaction.status !== 'disputed' || !transaction.dispute.is_active) {
        throw new Error('Transação não está em disputa');
      }
      
      // Atualizar resolução da disputa
      transaction.dispute.resolution = {
        decision: resolution.decision,
        notes: resolution.notes,
        timestamp: Date.now()
      };
      
      // Atualizar status da transação com base na decisão
      if (resolution.decision === 'buyer') {
        // Reembolso para o comprador (simplificado para o MVP)
        transaction.status = 'refunded';
      } else if (resolution.decision === 'seller') {
        // Liberar fundos para o vendedor
        transaction.status = 'completed';
        transaction.timestamps.completed = Date.now();
      } else if (resolution.decision === 'split') {
        // Divisão dos fundos (simplificado para o MVP)
        transaction.status = 'completed';
        transaction.timestamps.completed = Date.now();
      }
      
      // Marcar disputa como resolvida
      transaction.dispute.is_active = false;
      
      await transaction.save();
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Erro ao resolver disputa:', error);
      throw error;
    }
  }
}

module.exports = new EscrowService();
