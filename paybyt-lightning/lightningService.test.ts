import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import lightningService from '../services/lightningService';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Lightning Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('deve criar uma fatura Lightning via BTCPay Server', async () => {
      // Mock da resposta do BTCPay Server
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          id: 'invoice123',
          paymentRequest: 'lnbc1500n1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspk28uwq',
          status: 'New'
        }
      });

      // Mock da função de geração de QR code
      const originalGenerateQRCode = (lightningService as any).generateQRCode;
      (lightningService as any).generateQRCode = jest.fn().mockResolvedValue('data:image/png;base64,qrcode');

      // Chamar o método
      const invoice = await lightningService.createInvoice('0.001', 'Teste de pagamento', 'order123');

      // Verificar se o axios.post foi chamado corretamente
      expect(mockedAxios.post).toHaveBeenCalled();
      
      // Verificar se a fatura foi criada corretamente
      expect(invoice).toHaveProperty('invoiceId', 'invoice123');
      expect(invoice).toHaveProperty('paymentRequest');
      expect(invoice).toHaveProperty('amount', '0.001');
      expect(invoice).toHaveProperty('description', 'Teste de pagamento');
      expect(invoice).toHaveProperty('qrCodeUrl', 'data:image/png;base64,qrcode');
      expect(invoice).toHaveProperty('status', 'new');
      expect(invoice).toHaveProperty('platformFee');

      // Restaurar a função original
      (lightningService as any).generateQRCode = originalGenerateQRCode;
    });

    it('deve calcular corretamente a taxa da plataforma (1%)', async () => {
      // Mock da resposta do BTCPay Server
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          id: 'invoice123',
          paymentRequest: 'lnbc1500n1...',
          status: 'New'
        }
      });

      // Mock da função de geração de QR code
      const originalGenerateQRCode = (lightningService as any).generateQRCode;
      (lightningService as any).generateQRCode = jest.fn().mockResolvedValue('data:image/png;base64,qrcode');

      // Chamar o método com valor 1.0 BTC
      const invoice = await lightningService.createInvoice('1.0', 'Teste de taxa', 'order123');

      // Verificar se a taxa foi calculada corretamente (1% de 1.0 = 0.01)
      expect(parseFloat(invoice.platformFee || '0')).toBeCloseTo(0.01, 8);

      // Restaurar a função original
      (lightningService as any).generateQRCode = originalGenerateQRCode;
    });
  });

  describe('checkInvoiceStatus', () => {
    it('deve verificar o status de uma fatura corretamente', async () => {
      // Mock da resposta do BTCPay Server
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          id: 'invoice123',
          status: 'Settled'
        }
      });

      // Chamar o método
      const status = await lightningService.checkInvoiceStatus('invoice123');

      // Verificar se o axios.get foi chamado corretamente
      expect(mockedAxios.get).toHaveBeenCalled();
      
      // Verificar se o status foi mapeado corretamente
      expect(status).toBe('paid');
    });

    it('deve mapear diferentes status do BTCPay Server corretamente', async () => {
      // Testar diferentes status
      const statusMappings = [
        { btcpayStatus: 'New', expectedStatus: 'new' },
        { btcpayStatus: 'Processing', expectedStatus: 'new' },
        { btcpayStatus: 'Settled', expectedStatus: 'paid' },
        { btcpayStatus: 'Complete', expectedStatus: 'paid' },
        { btcpayStatus: 'Expired', expectedStatus: 'expired' },
        { btcpayStatus: 'Invalid', expectedStatus: 'invalid' }
      ];

      for (const mapping of statusMappings) {
        // Mock da resposta do BTCPay Server
        mockedAxios.get.mockResolvedValueOnce({
          data: {
            id: 'invoice123',
            status: mapping.btcpayStatus
          }
        });

        // Chamar o método
        const status = await lightningService.checkInvoiceStatus('invoice123');
        
        // Verificar se o status foi mapeado corretamente
        expect(status).toBe(mapping.expectedStatus);
      }
    });
  });

  describe('processBTCPayWebhook', () => {
    it('deve processar webhook de pagamento confirmado corretamente', async () => {
      // Criar uma fatura de teste
      const testInvoice = {
        invoiceId: 'invoice123',
        paymentRequest: 'lnbc1500n1...',
        amount: '0.001',
        description: 'Teste de webhook',
        qrCodeUrl: 'data:image/png;base64,qrcode',
        status: 'new',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        platformFee: '0.00001'
      };

      // Adicionar a fatura ao mapa de faturas
      (lightningService as any).invoices.set('invoice123', testInvoice);

      // Payload do webhook
      const webhookPayload = {
        invoiceId: 'invoice123',
        type: 'InvoiceSettled'
      };

      // Processar o webhook
      await lightningService.processBTCPayWebhook(webhookPayload);

      // Verificar se o status da fatura foi atualizado
      const updatedInvoice = (lightningService as any).invoices.get('invoice123');
      expect(updatedInvoice.status).toBe('paid');
    });
  });
});
