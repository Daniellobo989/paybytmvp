import axios from 'axios';
import * as qrcode from 'qrcode';

// Interfaces para faturas Lightning Network
export interface LightningInvoice {
  invoiceId: string;
  paymentRequest: string; // String BOLT11
  amount: string;
  description: string;
  qrCodeUrl: string;
  status: 'new' | 'paid' | 'expired' | 'invalid';
  createdAt: string;
  expiresAt: string;
  platformFee?: string; // Taxa de 1% da plataforma
}

// Interface para configuração do gateway Lightning
interface LightningGatewayConfig {
  type: 'btcpay' | 'opennode' | 'coingate';
  serverUrl: string;
  apiKey: string;
  storeId?: string; // Para BTCPay Server
}

// Classe para gerenciar pagamentos Lightning Network
class LightningService {
  private config: LightningGatewayConfig;
  private invoices: Map<string, LightningInvoice>;
  private storageKey = 'paybyt_lightning_invoices';

  constructor() {
    // Configuração do gateway principal (BTCPay Server)
    this.config = {
      type: 'btcpay',
      serverUrl: process.env.BTCPAY_SERVER_URL || 'https://testnet.demo.btcpayserver.org',
      apiKey: process.env.BTCPAY_API_KEY || 'API-KEY',  // Substituir por chave real em produção
      storeId: process.env.BTCPAY_STORE_ID || 'AYkzTyGM1vE4LQxWvVJcgS'  // ID de loja de exemplo
    };
    
    this.invoices = new Map();
    this.loadFromStorage();
  }

  // Carregar faturas do armazenamento local
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const storedInvoices = localStorage.getItem(this.storageKey);
      if (storedInvoices) {
        const invoicesArray = JSON.parse(storedInvoices) as LightningInvoice[];
        invoicesArray.forEach(invoice => {
          this.invoices.set(invoice.invoiceId, invoice);
        });
      }
    }
  }

  // Salvar faturas no armazenamento local
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const invoicesArray = Array.from(this.invoices.values());
      localStorage.setItem(this.storageKey, JSON.stringify(invoicesArray));
    }
  }

  // Calcular taxa da plataforma (1%)
  calculatePlatformFee(amount: string): string {
    const amountValue = parseFloat(amount);
    const feeValue = amountValue * 0.01; // 1% do valor
    return feeValue.toFixed(8); // 8 casas decimais para Bitcoin
  }

  // Criar uma nova fatura Lightning Network via BTCPay Server
  async createBTCPayInvoice(amount: string, description: string, orderId?: string): Promise<LightningInvoice> {
    try {
      // Calcular taxa da plataforma
      const platformFee = this.calculatePlatformFee(amount);
      const totalAmount = (parseFloat(amount) + parseFloat(platformFee)).toFixed(8);
      
      // Preparar dados para a API do BTCPay Server
      const invoiceData = {
        price: totalAmount,
        currency: 'BTC',
        orderId: orderId || `LN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        itemDesc: description,
        checkout: {
          speedPolicy: 'HighSpeed',
          paymentMethods: ['BTC_LightningNetwork'],
          expirationMinutes: 30,
          redirectURL: `${window.location.origin}/payment/success`,
          redirectAutomatically: true
        },
        metadata: {
          orderId: orderId,
          productPrice: amount,
          platformFee: platformFee
        }
      };
      
      // Fazer requisição para o BTCPay Server
      const response = await axios.post(
        `${this.config.serverUrl}/api/v1/stores/${this.config.storeId}/invoices`,
        invoiceData,
        {
          headers: {
            'Authorization': `token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extrair dados da resposta
      const invoiceId = response.data.id;
      const paymentRequest = response.data.paymentRequest;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000); // 30 minutos
      
      // Gerar QR code para o payment request
      const qrCodeUrl = await this.generateQRCode(paymentRequest);
      
      // Criar objeto de fatura
      const invoice: LightningInvoice = {
        invoiceId,
        paymentRequest,
        amount,
        description,
        qrCodeUrl,
        status: 'new',
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        platformFee
      };
      
      // Armazenar fatura
      this.invoices.set(invoiceId, invoice);
      this.saveToStorage();
      
      return invoice;
    } catch (error) {
      console.error('Erro ao criar fatura Lightning via BTCPay Server:', error);
      throw new Error('Falha ao criar fatura de pagamento Lightning');
    }
  }

  // Criar uma nova fatura Lightning Network via OpenNode (gateway secundário)
  async createOpenNodeInvoice(amount: string, description: string, orderId?: string): Promise<LightningInvoice> {
    try {
      // Calcular taxa da plataforma
      const platformFee = this.calculatePlatformFee(amount);
      const totalAmount = (parseFloat(amount) + parseFloat(platformFee)).toFixed(8);
      
      // Converter para satoshis (OpenNode usa satoshis)
      const amountSats = Math.floor(parseFloat(totalAmount) * 100000000);
      
      // Preparar dados para a API do OpenNode
      const invoiceData = {
        amount: amountSats,
        description: description,
        order_id: orderId || `LN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        callback_url: `${window.location.origin}/api/lightning/webhook/opennode`,
        success_url: `${window.location.origin}/payment/success`,
        metadata: {
          orderId: orderId,
          productPrice: amount,
          platformFee: platformFee
        }
      };
      
      // Configuração para OpenNode
      const openNodeConfig = {
        serverUrl: process.env.OPENNODE_API_URL || 'https://api.opennode.com',
        apiKey: process.env.OPENNODE_API_KEY || 'OPENNODE-API-KEY' // Substituir por chave real em produção
      };
      
      // Fazer requisição para o OpenNode
      const response = await axios.post(
        `${openNodeConfig.serverUrl}/v1/charges`,
        invoiceData,
        {
          headers: {
            'Authorization': openNodeConfig.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extrair dados da resposta
      const invoiceId = response.data.data.id;
      const paymentRequest = response.data.data.lightning_invoice.payreq;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000); // 1 hora (padrão OpenNode)
      
      // Gerar QR code para o payment request
      const qrCodeUrl = await this.generateQRCode(paymentRequest);
      
      // Criar objeto de fatura
      const invoice: LightningInvoice = {
        invoiceId,
        paymentRequest,
        amount,
        description,
        qrCodeUrl,
        status: 'new',
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        platformFee
      };
      
      // Armazenar fatura
      this.invoices.set(invoiceId, invoice);
      this.saveToStorage();
      
      return invoice;
    } catch (error) {
      console.error('Erro ao criar fatura Lightning via OpenNode:', error);
      throw new Error('Falha ao criar fatura de pagamento Lightning');
    }
  }

  // Método principal para criar fatura Lightning (escolhe o gateway apropriado)
  async createInvoice(amount: string, description: string, orderId?: string, gateway: 'btcpay' | 'opennode' = 'btcpay'): Promise<LightningInvoice> {
    if (gateway === 'btcpay') {
      return this.createBTCPayInvoice(amount, description, orderId);
    } else {
      return this.createOpenNodeInvoice(amount, description, orderId);
    }
  }

  // Verificar status de uma fatura Lightning via BTCPay Server
  async checkBTCPayInvoiceStatus(invoiceId: string): Promise<'new' | 'paid' | 'expired' | 'invalid'> {
    try {
      // Fazer requisição para o BTCPay Server
      const response = await axios.get(
        `${this.config.serverUrl}/api/v1/stores/${this.config.storeId}/invoices/${invoiceId}`,
        {
          headers: {
            'Authorization': `token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Mapear status do BTCPay Server para nosso formato
      const btcpayStatus = response.data.status;
      let status: 'new' | 'paid' | 'expired' | 'invalid';
      
      switch (btcpayStatus) {
        case 'New':
        case 'Processing':
          status = 'new';
          break;
        case 'Settled':
        case 'Complete':
          status = 'paid';
          break;
        case 'Expired':
          status = 'expired';
          break;
        default:
          status = 'invalid';
      }
      
      // Atualizar status da fatura no armazenamento local
      const invoice = this.invoices.get(invoiceId);
      if (invoice) {
        invoice.status = status;
        this.invoices.set(invoiceId, invoice);
        this.saveToStorage();
      }
      
      return status;
    } catch (error) {
      console.error('Erro ao verificar status da fatura Lightning via BTCPay Server:', error);
      throw new Error('Falha ao verificar status do pagamento Lightning');
    }
  }

  // Verificar status de uma fatura Lightning via OpenNode
  async checkOpenNodeInvoiceStatus(invoiceId: string): Promise<'new' | 'paid' | 'expired' | 'invalid'> {
    try {
      // Configuração para OpenNode
      const openNodeConfig = {
        serverUrl: process.env.OPENNODE_API_URL || 'https://api.opennode.com',
        apiKey: process.env.OPENNODE_API_KEY || 'OPENNODE-API-KEY' // Substituir por chave real em produção
      };
      
      // Fazer requisição para o OpenNode
      const response = await axios.get(
        `${openNodeConfig.serverUrl}/v1/charge/${invoiceId}`,
        {
          headers: {
            'Authorization': openNodeConfig.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Mapear status do OpenNode para nosso formato
      const openNodeStatus = response.data.data.status;
      let status: 'new' | 'paid' | 'expired' | 'invalid';
      
      switch (openNodeStatus) {
        case 'unpaid':
          status = 'new';
          break;
        case 'paid':
        case 'processing':
        case 'confirmed':
          status = 'paid';
          break;
        case 'expired':
          status = 'expired';
          break;
        default:
          status = 'invalid';
      }
      
      // Atualizar status da fatura no armazenamento local
      const invoice = this.invoices.get(invoiceId);
      if (invoice) {
        invoice.status = status;
        this.invoices.set(invoiceId, invoice);
        this.saveToStorage();
      }
      
      return status;
    } catch (error) {
      console.error('Erro ao verificar status da fatura Lightning via OpenNode:', error);
      throw new Error('Falha ao verificar status do pagamento Lightning');
    }
  }

  // Método principal para verificar status de fatura (escolhe o gateway apropriado)
  async checkInvoiceStatus(invoiceId: string, gateway: 'btcpay' | 'opennode' = 'btcpay'): Promise<'new' | 'paid' | 'expired' | 'invalid'> {
    if (gateway === 'btcpay') {
      return this.checkBTCPayInvoiceStatus(invoiceId);
    } else {
      return this.checkOpenNodeInvoiceStatus(invoiceId);
    }
  }

  // Gerar QR code para pagamento
  private async generateQRCode(data: string): Promise<string> {
    try {
      // Gerar QR code como string de dados URL
      return await qrcode.toDataURL(data.toUpperCase());
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      throw new Error('Falha ao gerar QR code para pagamento Lightning');
    }
  }

  // Obter uma fatura pelo ID
  getInvoice(invoiceId: string): LightningInvoice | undefined {
    return this.invoices.get(invoiceId);
  }

  // Obter todas as faturas
  getAllInvoices(): LightningInvoice[] {
    return Array.from(this.invoices.values());
  }

  // Processar webhook do BTCPay Server
  async processBTCPayWebhook(payload: any): Promise<void> {
    try {
      const invoiceId = payload.invoiceId;
      const invoice = this.invoices.get(invoiceId);
      
      if (!invoice) {
        console.warn(`Webhook recebido para fatura desconhecida: ${invoiceId}`);
        return;
      }
      
      // Atualizar status da fatura com base no webhook
      if (payload.type === 'InvoiceSettled' || payload.type === 'InvoicePaymentSettled') {
        invoice.status = 'paid';
        this.invoices.set(invoiceId, invoice);
        this.saveToStorage();
        
        // Aqui você pode adicionar lógica para processar o pagamento
        // Por exemplo, atualizar o status do pedido, enviar notificação, etc.
        console.log(`Pagamento Lightning confirmado para fatura: ${invoiceId}`);
      }
    } catch (error) {
      console.error('Erro ao processar webhook do BTCPay Server:', error);
    }
  }

  // Processar webhook do OpenNode
  async processOpenNodeWebhook(payload: any): Promise<void> {
    try {
      const invoiceId = payload.id;
      const invoice = this.invoices.get(invoiceId);
      
      if (!invoice) {
        console.warn(`Webhook recebido para fatura desconhecida: ${invoiceId}`);
        return;
      }
      
      // Atualizar status da fatura com base no webhook
      if (payload.status === 'paid' || payload.status === 'confirmed') {
        invoice.status = 'paid';
        this.invoices.set(invoiceId, invoice);
        this.saveToStorage();
        
        // Aqui você pode adicionar lógica para processar o pagamento
        // Por exemplo, atualizar o status do pedido, enviar notificação, etc.
        console.log(`Pagamento Lightning confirmado para fatura: ${invoiceId}`);
      }
    } catch (error) {
      console.error('Erro ao processar webhook do OpenNode:', error);
    }
  }
}

export default new LightningService();
