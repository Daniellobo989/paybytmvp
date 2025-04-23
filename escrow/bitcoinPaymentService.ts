import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';
import * as qrcode from 'qrcode';

// Interface para fatura de pagamento
export interface PaymentInvoice {
  invoiceId: string;
  amount: string;
  paymentUrl: string;
  qrCodeUrl: string;
  status: 'new' | 'paid' | 'expired' | 'invalid';
  createdAt: string;
  expiresAt: string;
}

// Interface para configuração do BTCPay Server
interface BTCPayConfig {
  serverUrl: string;
  storeId: string;
  apiKey: string;
}

// Classe para gerenciar pagamentos Bitcoin via BTCPay Server
class BitcoinPaymentService {
  private config: BTCPayConfig;

  constructor() {
    // Configuração do BTCPay Server (em produção, viria de variáveis de ambiente)
    this.config = {
      serverUrl: 'https://testnet.demo.btcpayserver.org',
      storeId: 'AYkzTyGM1vE4LQxWvVJcgS',  // ID de loja de exemplo
      apiKey: 'API-KEY'  // Substituir por chave real em produção
    };
  }

  // Criar uma nova fatura de pagamento
  async createInvoice(amount: string, description: string, orderId?: string): Promise<PaymentInvoice> {
    try {
      // Em produção, esta seria uma chamada real para o BTCPay Server
      // Para fins de demonstração, simulamos a resposta
      
      // Gerar ID único para a fatura
      const invoiceId = 'INV' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Calcular data de expiração (30 minutos a partir de agora)
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);
      
      // Gerar URL de pagamento
      const paymentUrl = `${this.config.serverUrl}/i/${invoiceId}`;
      
      // Gerar QR code para o pagamento
      const qrCodeUrl = await this.generateQRCode(`bitcoin:?amount=${amount}&label=${encodeURIComponent(description)}`);
      
      // Criar objeto de fatura
      const invoice: PaymentInvoice = {
        invoiceId,
        amount,
        paymentUrl,
        qrCodeUrl,
        status: 'new',
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString()
      };
      
      // Em uma implementação real, salvaríamos a fatura no armazenamento local
      this.saveInvoiceToStorage(invoice);
      
      return invoice;
    } catch (error) {
      console.error('Erro ao criar fatura de pagamento:', error);
      throw new Error('Falha ao criar fatura de pagamento Bitcoin');
    }
  }

  // Verificar status de uma fatura
  async checkInvoiceStatus(invoiceId: string): Promise<'new' | 'paid' | 'expired' | 'invalid'> {
    try {
      // Em produção, esta seria uma chamada real para o BTCPay Server
      // Para fins de demonstração, recuperamos a fatura do armazenamento local
      const invoice = this.getInvoiceFromStorage(invoiceId);
      
      if (!invoice) {
        return 'invalid';
      }
      
      // Verificar se a fatura expirou
      const now = new Date();
      const expiresAt = new Date(invoice.expiresAt);
      
      if (now > expiresAt && invoice.status === 'new') {
        // Atualizar status da fatura para expirada
        invoice.status = 'expired';
        this.saveInvoiceToStorage(invoice);
        return 'expired';
      }
      
      // Em uma implementação real, verificaríamos o status real da fatura no BTCPay Server
      // Para fins de demonstração, simulamos uma chance de 30% de a fatura ter sido paga
      if (invoice.status === 'new' && Math.random() < 0.3) {
        invoice.status = 'paid';
        this.saveInvoiceToStorage(invoice);
      }
      
      return invoice.status;
    } catch (error) {
      console.error('Erro ao verificar status da fatura:', error);
      throw new Error('Falha ao verificar status do pagamento');
    }
  }

  // Gerar QR code para pagamento
  private async generateQRCode(data: string): Promise<string> {
    try {
      // Gerar QR code como string de dados URL
      return await qrcode.toDataURL(data);
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      throw new Error('Falha ao gerar QR code para pagamento');
    }
  }

  // Salvar fatura no armazenamento local
  private saveInvoiceToStorage(invoice: PaymentInvoice): void {
    if (typeof window !== 'undefined') {
      // Recuperar faturas existentes
      const invoicesJson = localStorage.getItem('paybyt_invoices') || '{}';
      const invoices = JSON.parse(invoicesJson);
      
      // Adicionar ou atualizar fatura
      invoices[invoice.invoiceId] = invoice;
      
      // Salvar de volta no armazenamento local
      localStorage.setItem('paybyt_invoices', JSON.stringify(invoices));
    }
  }

  // Recuperar fatura do armazenamento local
  private getInvoiceFromStorage(invoiceId: string): PaymentInvoice | null {
    if (typeof window !== 'undefined') {
      // Recuperar faturas existentes
      const invoicesJson = localStorage.getItem('paybyt_invoices') || '{}';
      const invoices = JSON.parse(invoicesJson);
      
      // Retornar fatura específica
      return invoices[invoiceId] || null;
    }
    return null;
  }

  // Criar um endereço de pagamento Lightning Network
  async createLightningInvoice(amount: string, description: string): Promise<{
    paymentRequest: string;
    qrCodeUrl: string;
  }> {
    try {
      // Em produção, esta seria uma chamada real para o BTCPay Server ou outro provedor LN
      // Para fins de demonstração, simulamos um payment request Lightning
      
      // Simular um payment request Lightning (BOLT11)
      const paymentRequest = `lnbc${amount.replace('.', '')}p1pjz9d0pp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0wgkuctrv5s9xmmwwdkxctt5v5sxxmmfde5xzmntwvsz43zepfv4jxumtwv4exzmnfd35zpmhyf5x7mmwwd68zmmwwdexjum9wdshgmmjwd68zmmwwd3xjmm9wd3hjmmtw3jhxm0cwdt5xz5mhyf5x7mnyypshyf5x7mmwwdexjum9wd3hxmmtw3jhxm0cwdt5xz5mhyf5x7mnyypshyf5x7mmwwdexjum9wd3hxmmtw3jhxm0cwdt5xz5m9ysxymm5wdcxqyjw5qcqp2rzjq0gxwkzc8w6323m55m4jyxcjwmy7stt9hwkwe2qxmy8zpsgg7jcuxy0cqzpgxqyz5vqsp5usyc4lk9chsfp53kvcnvq456ganh60d89zpne2c5xpjqwl9zknqs9qyyssqd4jmzuhjfchw2687h65qnfk4jvgh9v5vdnhezsq8dyhd5xhe9wgzl957ztkz3gdj3xxyr9l7u8yhh2jsnf8f2hr5t5ku6q35c48a2gq4ex0dx`;
      
      // Gerar QR code para o payment request
      const qrCodeUrl = await this.generateQRCode(paymentRequest.toUpperCase());
      
      return {
        paymentRequest,
        qrCodeUrl
      };
    } catch (error) {
      console.error('Erro ao criar fatura Lightning:', error);
      throw new Error('Falha ao criar fatura de pagamento Lightning');
    }
  }

  // Verificar status de um pagamento Lightning
  async checkLightningPaymentStatus(paymentRequest: string): Promise<boolean> {
    try {
      // Em produção, esta seria uma chamada real para o BTCPay Server ou outro provedor LN
      // Para fins de demonstração, simulamos uma chance de 50% de o pagamento ter sido recebido
      return Math.random() < 0.5;
    } catch (error) {
      console.error('Erro ao verificar pagamento Lightning:', error);
      throw new Error('Falha ao verificar status do pagamento Lightning');
    }
  }
}

export default new BitcoinPaymentService();
