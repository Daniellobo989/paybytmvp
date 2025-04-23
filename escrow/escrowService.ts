import { v4 as uuidv4 } from 'uuid';
import bitcoinService, { MultisigAddress, Transaction } from './bitcoinService';

// Interface para dados do escrow
export interface EscrowData {
  escrowId: string;
  escrowAddress: string;
  redeemScript: string;
  buyerAddress: string;
  sellerAddress: string;
  mediatorAddress: string;
  amount: string;
  description: string;
  timelock: string;
  status: 'created' | 'funded' | 'in_progress' | 'completed' | 'refunded' | 'disputed';
  createdAt: string;
  updatedAt: string;
  deliveryConfirmed?: boolean;
  disputeReason?: string;
  txid?: string;
}

// Classe para gerenciar operações de escrow
class EscrowService {
  private escrows: Map<string, EscrowData>;
  private storageKey = 'paybyt_escrows';
  private mediatorPubKey = '03a882d414e478039cd5b52a92ffb13dd5e6bd4515497439dffd691a0f12af9575'; // Chave pública do mediador (PayByt)

  constructor() {
    this.escrows = new Map();
    this.loadFromStorage();
  }

  // Carregar escrows do armazenamento local
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const storedEscrows = localStorage.getItem(this.storageKey);
      if (storedEscrows) {
        const escrowsArray = JSON.parse(storedEscrows) as EscrowData[];
        escrowsArray.forEach(escrow => {
          this.escrows.set(escrow.escrowId, escrow);
        });
      }
    }
  }

  // Salvar escrows no armazenamento local
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const escrowsArray = Array.from(this.escrows.values());
      localStorage.setItem(this.storageKey, JSON.stringify(escrowsArray));
    }
  }

  // Criar um novo escrow
  async createEscrow(
    buyerAddress: string,
    sellerAddress: string,
    amount: string,
    description: string,
    timelock: string
  ): Promise<EscrowData> {
    try {
      // Gerar ID único para o escrow
      const escrowId = 'ESC' + uuidv4().substring(0, 8).toUpperCase();
      
      // Criar endereço multisig 2-de-3 com bitcoinjs-lib
      const multisigAddress: MultisigAddress = bitcoinService.createMultisigAddress(
        buyerAddress,
        sellerAddress,
        this.mediatorPubKey
      );
      
      // Criar objeto de escrow
      const escrow: EscrowData = {
        escrowId,
        escrowAddress: multisigAddress.address,
        redeemScript: multisigAddress.redeemScript,
        buyerAddress,
        sellerAddress,
        mediatorAddress: this.mediatorPubKey,
        amount,
        description,
        timelock,
        status: 'created',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryConfirmed: false
      };
      
      // Armazenar escrow
      this.escrows.set(escrowId, escrow);
      this.saveToStorage();
      
      return escrow;
    } catch (error) {
      console.error('Erro ao criar escrow:', error);
      throw new Error('Falha ao criar escrow multisig');
    }
  }

  // Obter um escrow pelo ID
  getEscrow(escrowId: string): EscrowData | undefined {
    return this.escrows.get(escrowId);
  }

  // Obter todos os escrows
  getAllEscrows(): EscrowData[] {
    return Array.from(this.escrows.values());
  }

  // Verificar se um escrow está financiado
  async checkEscrowFunding(escrowId: string): Promise<boolean> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    try {
      // Verificar saldo do endereço de escrow
      const balance = await bitcoinService.getAddressBalance(escrow.escrowAddress);
      const escrowAmount = parseFloat(escrow.amount);
      
      // Se o saldo for maior ou igual ao valor do escrow, considerar financiado
      if (balance >= escrowAmount) {
        // Atualizar status do escrow
        escrow.status = 'funded';
        escrow.updatedAt = new Date().toISOString();
        this.escrows.set(escrowId, escrow);
        this.saveToStorage();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar financiamento do escrow:', error);
      throw new Error('Falha ao verificar financiamento do escrow');
    }
  }

  // Confirmar entrega (pelo comprador)
  confirmDelivery(escrowId: string): EscrowData {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    if (escrow.status !== 'funded' && escrow.status !== 'in_progress') {
      throw new Error('Status do escrow não permite confirmação de entrega');
    }
    
    // Atualizar status do escrow
    escrow.deliveryConfirmed = true;
    escrow.status = 'in_progress';
    escrow.updatedAt = new Date().toISOString();
    this.escrows.set(escrowId, escrow);
    this.saveToStorage();
    
    return escrow;
  }

  // Liberar fundos para o vendedor
  async releaseFunds(escrowId: string, buyerPrivateKey: string): Promise<string> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    if (escrow.status !== 'funded' && escrow.status !== 'in_progress') {
      throw new Error('Status do escrow não permite liberação de fundos');
    }
    
    if (!escrow.deliveryConfirmed) {
      throw new Error('A entrega deve ser confirmada antes de liberar os fundos');
    }
    
    try {
      // Simular a segunda chave privada (em produção, seria fornecida pelo vendedor ou mediador)
      // NOTA: Em um ambiente real, o vendedor ou mediador assinaria a transação com sua própria chave
      const mediatorPrivateKey = 'cVQVgBr8sW4FTPYz16Wbat1tqpNgdunMcyAZtJA9ug1sBL1RASW8'; // Apenas para simulação
      
      // Criar transação para liberar fundos
      const txHex = await bitcoinService.createReleaseTransaction(
        escrow.escrowAddress,
        escrow.redeemScript,
        escrow.sellerAddress,
        parseFloat(escrow.amount),
        buyerPrivateKey,
        mediatorPrivateKey
      );
      
      // Transmitir transação para a rede Bitcoin
      const txid = await bitcoinService.broadcastTransaction(txHex);
      
      // Atualizar status do escrow
      escrow.status = 'completed';
      escrow.txid = txid;
      escrow.updatedAt = new Date().toISOString();
      this.escrows.set(escrowId, escrow);
      this.saveToStorage();
      
      return txid;
    } catch (error) {
      console.error('Erro ao liberar fundos:', error);
      throw new Error('Falha ao liberar fundos do escrow');
    }
  }

  // Reembolsar fundos para o comprador
  async refundBuyer(escrowId: string, sellerPrivateKey: string): Promise<string> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    if (escrow.status !== 'funded' && escrow.status !== 'in_progress' && escrow.status !== 'disputed') {
      throw new Error('Status do escrow não permite reembolso');
    }
    
    try {
      // Simular a segunda chave privada (em produção, seria fornecida pelo comprador ou mediador)
      // NOTA: Em um ambiente real, o comprador ou mediador assinaria a transação com sua própria chave
      const mediatorPrivateKey = 'cVQVgBr8sW4FTPYz16Wbat1tqpNgdunMcyAZtJA9ug1sBL1RASW8'; // Apenas para simulação
      
      // Criar transação para reembolsar fundos
      const txHex = await bitcoinService.createReleaseTransaction(
        escrow.escrowAddress,
        escrow.redeemScript,
        escrow.buyerAddress,
        parseFloat(escrow.amount),
        sellerPrivateKey,
        mediatorPrivateKey
      );
      
      // Transmitir transação para a rede Bitcoin
      const txid = await bitcoinService.broadcastTransaction(txHex);
      
      // Atualizar status do escrow
      escrow.status = 'refunded';
      escrow.txid = txid;
      escrow.updatedAt = new Date().toISOString();
      this.escrows.set(escrowId, escrow);
      this.saveToStorage();
      
      return txid;
    } catch (error) {
      console.error('Erro ao reembolsar comprador:', error);
      throw new Error('Falha ao reembolsar fundos do escrow');
    }
  }

  // Abrir disputa
  openDispute(escrowId: string, reason: string): EscrowData {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    if (escrow.status !== 'funded' && escrow.status !== 'in_progress') {
      throw new Error('Status do escrow não permite abrir disputa');
    }
    
    // Atualizar status do escrow
    escrow.status = 'disputed';
    escrow.disputeReason = reason;
    escrow.updatedAt = new Date().toISOString();
    this.escrows.set(escrowId, escrow);
    this.saveToStorage();
    
    return escrow;
  }

  // Resolver disputa (pelo mediador)
  async resolveDispute(
    escrowId: string,
    mediatorPrivateKey: string,
    favorBuyer: boolean
  ): Promise<string> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) {
      throw new Error('Escrow não encontrado');
    }
    
    if (escrow.status !== 'disputed') {
      throw new Error('Escrow não está em disputa');
    }
    
    try {
      // Simular a segunda chave privada (em produção, seria fornecida pelo comprador ou vendedor)
      // NOTA: Em um ambiente real, o comprador ou vendedor assinaria a transação com sua própria chave
      const secondPrivateKey = favorBuyer 
        ? 'cVQVgBr8sW4FTPYz16Wbat1tqpNgdunMcyAZtJA9ug1sBL1RASW8' // Simulação da chave do comprador
        : 'cVQVgBr8sW4FTPYz16Wbat1tqpNgdunMcyAZtJA9ug1sBL1RASW8'; // Simulação da chave do vendedor
      
      // Determinar o destinatário com base na decisão
      const destinationAddress = favorBuyer ? escrow.buyerAddress : escrow.sellerAddress;
      
      // Criar transação para resolver disputa
      const txHex = await bitcoinService.createReleaseTransaction(
        escrow.escrowAddress,
        escrow.redeemScript,
        destinationAddress,
        parseFloat(escrow.amount),
        mediatorPrivateKey,
        secondPrivateKey
      );
      
      // Transmitir transação para a rede Bitcoin
      const txid = await bitcoinService.broadcastTransaction(txHex);
      
      // Atualizar status do escrow
      escrow.status = favorBuyer ? 'refunded' : 'completed';
      escrow.txid = txid;
      escrow.updatedAt = new Date().toISOString();
      this.escrows.set(escrowId, escrow);
      this.saveToStorage();
      
      return txid;
    } catch (error) {
      console.error('Erro ao resolver disputa:', error);
      throw new Error('Falha ao resolver disputa do escrow');
    }
  }

  // Verificar status de uma transação
  async checkTransactionStatus(escrowId: string): Promise<Transaction | null> {
    const escrow = this.escrows.get(escrowId);
    if (!escrow || !escrow.txid) {
      return null;
    }
    
    try {
      return await bitcoinService.getTransactionStatus(escrow.txid);
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      throw new Error('Falha ao verificar status da transação');
    }
  }
}

export default new EscrowService();
