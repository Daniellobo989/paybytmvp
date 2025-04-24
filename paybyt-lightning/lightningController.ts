import { Request, Response } from 'express';
import lightningService, { LightningInvoice } from '../services/lightningService';
import feeService from '../services/feeService';

// Controlador para operações Lightning Network
class LightningController {
  // Criar nova fatura Lightning
  async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { amount, description, orderId, gateway = 'btcpay' } = req.body;
      
      // Validar parâmetros
      if (!amount || !description) {
        res.status(400).json({ error: 'Parâmetros inválidos. amount e description são obrigatórios.' });
        return;
      }
      
      // Calcular taxa da plataforma
      const platformFee = feeService.calculatePlatformFee(amount);
      
      // Criar fatura
      const invoice = await lightningService.createInvoice(
        amount,
        description,
        orderId,
        gateway as 'btcpay' | 'opennode'
      );
      
      // Registrar taxa da plataforma
      feeService.recordFeeCollection(
        invoice.invoiceId,
        amount,
        platformFee,
        'platform'
      );
      
      res.status(201).json(invoice);
    } catch (error) {
      console.error('Erro ao criar fatura Lightning:', error);
      res.status(500).json({ error: 'Falha ao criar fatura Lightning' });
    }
  }

  // Verificar status de uma fatura
  async checkInvoiceStatus(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params;
      const { gateway = 'btcpay' } = req.query;
      
      if (!invoiceId) {
        res.status(400).json({ error: 'ID da fatura é obrigatório' });
        return;
      }
      
      const status = await lightningService.checkInvoiceStatus(
        invoiceId,
        gateway as 'btcpay' | 'opennode'
      );
      
      res.status(200).json({ invoiceId, status });
    } catch (error) {
      console.error('Erro ao verificar status da fatura:', error);
      res.status(500).json({ error: 'Falha ao verificar status da fatura' });
    }
  }

  // Obter uma fatura pelo ID
  async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params;
      
      if (!invoiceId) {
        res.status(400).json({ error: 'ID da fatura é obrigatório' });
        return;
      }
      
      const invoice = lightningService.getInvoice(invoiceId);
      
      if (!invoice) {
        res.status(404).json({ error: 'Fatura não encontrada' });
        return;
      }
      
      res.status(200).json(invoice);
    } catch (error) {
      console.error('Erro ao obter fatura:', error);
      res.status(500).json({ error: 'Falha ao obter fatura' });
    }
  }

  // Obter todas as faturas
  async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = lightningService.getAllInvoices();
      res.status(200).json(invoices);
    } catch (error) {
      console.error('Erro ao obter faturas:', error);
      res.status(500).json({ error: 'Falha ao obter faturas' });
    }
  }

  // Processar webhook do BTCPay Server
  async processBTCPayWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      
      // Verificar assinatura do webhook (em produção)
      // const signature = req.headers['btcpay-sig'];
      // if (!verifySignature(payload, signature)) {
      //   res.status(401).json({ error: 'Assinatura inválida' });
      //   return;
      // }
      
      await lightningService.processBTCPayWebhook(payload);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao processar webhook BTCPay:', error);
      res.status(500).json({ error: 'Falha ao processar webhook' });
    }
  }

  // Processar webhook do OpenNode
  async processOpenNodeWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      
      // Verificar assinatura do webhook (em produção)
      // const signature = req.headers['opennode-signature'];
      // if (!verifyOpenNodeSignature(payload, signature)) {
      //   res.status(401).json({ error: 'Assinatura inválida' });
      //   return;
      // }
      
      await lightningService.processOpenNodeWebhook(payload);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erro ao processar webhook OpenNode:', error);
      res.status(500).json({ error: 'Falha ao processar webhook' });
    }
  }

  // Estimar taxas para uma transação
  async estimateFees(req: Request, res: Response): Promise<void> {
    try {
      const { amount, type = 'all' } = req.query;
      
      if (!amount) {
        res.status(400).json({ error: 'Valor da transação é obrigatório' });
        return;
      }
      
      const amountStr = amount as string;
      
      const result: any = {};
      
      // Calcular taxa da plataforma
      if (type === 'all' || type === 'platform') {
        result.platformFee = feeService.calculatePlatformFee(amountStr);
      }
      
      // Estimar taxa de mineração on-chain
      if (type === 'all' || type === 'mining') {
        result.miningFee = await feeService.estimateOnChainFee();
      }
      
      // Estimar taxa de roteamento Lightning
      if (type === 'all' || type === 'routing') {
        result.routingFee = await feeService.estimateLightningRoutingFee(amountStr);
      }
      
      // Calcular total se todas as taxas foram solicitadas
      if (type === 'all') {
        result.totalFees = (
          parseFloat(result.platformFee) + 
          result.miningFee + 
          parseFloat(result.routingFee)
        ).toFixed(8);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao estimar taxas:', error);
      res.status(500).json({ error: 'Falha ao estimar taxas' });
    }
  }
}

export default new LightningController();
