import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';

// Configuração da rede Bitcoin (mainnet ou testnet)
const network = bitcoin.networks.testnet; // Usar testnet para desenvolvimento

// Interface para o endereço multisig
export interface MultisigAddress {
  address: string;
  redeemScript: string;
  scriptPubKey: string;
}

// Interface para transação
export interface Transaction {
  txid: string;
  confirmations: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// Classe para gerenciar operações Bitcoin
class BitcoinService {
  private btcPayServerUrl: string;
  private apiKey: string;

  constructor() {
    // Estas informações devem vir de variáveis de ambiente em produção
    this.btcPayServerUrl = 'https://testnet.demo.btcpayserver.org';
    this.apiKey = 'YourBTCPayServerAPIKey'; // Substituir por chave real em produção
  }

  // Gerar um par de chaves Bitcoin
  generateKeyPair() {
    const keyPair = bitcoin.ECPair.makeRandom({ network });
    return {
      publicKey: keyPair.publicKey.toString('hex'),
      privateKey: keyPair.privateKey?.toString('hex'),
      wif: keyPair.toWIF()
    };
  }

  // Criar um endereço multisig 2-de-3
  createMultisigAddress(pubKey1: string, pubKey2: string, pubKey3: string): MultisigAddress {
    const pubKeys = [
      Buffer.from(pubKey1, 'hex'),
      Buffer.from(pubKey2, 'hex'),
      Buffer.from(pubKey3, 'hex')
    ].map(key => bitcoin.ECPair.fromPublicKey(key, { network }).publicKey);

    // Criar script de resgate multisig 2-de-3
    const redeemScript = bitcoin.payments.p2ms({
      m: 2, // 2 de 3 assinaturas necessárias
      pubkeys: pubKeys,
      network
    }).output as Buffer;

    // Criar endereço P2SH a partir do script de resgate
    const p2sh = bitcoin.payments.p2sh({
      redeem: { output: redeemScript, network },
      network
    });

    return {
      address: p2sh.address as string,
      redeemScript: redeemScript.toString('hex'),
      scriptPubKey: p2sh.output?.toString('hex') as string
    };
  }

  // Verificar saldo de um endereço
  async getAddressBalance(address: string): Promise<number> {
    try {
      // Usar API pública para verificar saldo (ex: Blockstream API para testnet)
      const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}`);
      
      // Converter satoshis para BTC
      return response.data.chain_stats.funded_txo_sum / 100000000;
    } catch (error) {
      console.error('Erro ao verificar saldo:', error);
      throw new Error('Falha ao verificar saldo do endereço');
    }
  }

  // Verificar se uma transação foi confirmada
  async getTransactionStatus(txid: string): Promise<Transaction> {
    try {
      // Usar API pública para verificar status da transação
      const response = await axios.get(`https://blockstream.info/testnet/api/tx/${txid}`);
      
      return {
        txid,
        confirmations: response.data.status.confirmed ? response.data.status.block_height : 0,
        amount: response.data.vout.reduce((sum: number, output: any) => sum + output.value, 0) / 100000000,
        status: response.data.status.confirmed ? 'confirmed' : 'pending'
      };
    } catch (error) {
      console.error('Erro ao verificar transação:', error);
      return {
        txid,
        confirmations: 0,
        amount: 0,
        status: 'failed'
      };
    }
  }

  // Criar uma transação para liberar fundos do escrow
  async createReleaseTransaction(
    escrowAddress: string,
    redeemScript: string,
    destinationAddress: string,
    amount: number,
    privateKey1: string,
    privateKey2: string
  ): Promise<string> {
    try {
      // Obter UTXOs do endereço de escrow
      const utxosResponse = await axios.get(`https://blockstream.info/testnet/api/address/${escrowAddress}/utxo`);
      const utxos = utxosResponse.data;

      if (utxos.length === 0) {
        throw new Error('Nenhum UTXO encontrado para o endereço de escrow');
      }

      // Criar transação
      const txb = new bitcoin.TransactionBuilder(network);
      
      // Adicionar inputs (UTXOs)
      let totalInput = 0;
      for (const utxo of utxos) {
        txb.addInput(utxo.txid, utxo.vout);
        totalInput += utxo.value;
      }

      // Converter amount de BTC para satoshis
      const amountSatoshis = Math.floor(amount * 100000000);
      
      // Calcular taxa (simplificado - em produção, usar estimativa de taxa)
      const fee = 10000; // 10000 satoshis (0.0001 BTC)
      
      // Verificar se há fundos suficientes
      if (totalInput < amountSatoshis + fee) {
        throw new Error('Fundos insuficientes para completar a transação');
      }

      // Adicionar output para o destinatário
      txb.addOutput(destinationAddress, amountSatoshis);
      
      // Se houver troco, enviar de volta para o escrow
      if (totalInput > amountSatoshis + fee) {
        txb.addOutput(escrowAddress, totalInput - amountSatoshis - fee);
      }

      // Converter redeemScript de hex para Buffer
      const redeemScriptBuffer = Buffer.from(redeemScript, 'hex');
      
      // Criar keypairs a partir das chaves privadas
      const keyPair1 = bitcoin.ECPair.fromWIF(privateKey1, network);
      const keyPair2 = bitcoin.ECPair.fromWIF(privateKey2, network);

      // Assinar cada input com ambas as chaves
      for (let i = 0; i < utxos.length; i++) {
        txb.sign(i, keyPair1, redeemScriptBuffer, undefined, utxos[i].value);
        txb.sign(i, keyPair2, redeemScriptBuffer, undefined, utxos[i].value);
      }

      // Construir e serializar a transação
      const tx = txb.build();
      return tx.toHex();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw new Error('Falha ao criar transação de liberação');
    }
  }

  // Transmitir transação para a rede Bitcoin
  async broadcastTransaction(txHex: string): Promise<string> {
    try {
      // Usar API pública para transmitir transação
      const response = await axios.post('https://blockstream.info/testnet/api/tx', txHex);
      return response.data; // txid
    } catch (error) {
      console.error('Erro ao transmitir transação:', error);
      throw new Error('Falha ao transmitir transação para a rede Bitcoin');
    }
  }

  // Integração com BTCPay Server para criar uma fatura
  async createInvoice(amount: number, description: string): Promise<{invoiceId: string, paymentUrl: string}> {
    try {
      const response = await axios.post(
        `${this.btcPayServerUrl}/api/v1/stores/YourStoreId/invoices`,
        {
          amount,
          currency: 'BTC',
          metadata: {
            description,
            orderId: `ESC${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          }
        },
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        invoiceId: response.data.id,
        paymentUrl: response.data.checkoutLink
      };
    } catch (error) {
      console.error('Erro ao criar fatura BTCPay:', error);
      throw new Error('Falha ao criar fatura de pagamento');
    }
  }

  // Verificar status de uma fatura BTCPay
  async checkInvoiceStatus(invoiceId: string): Promise<'new' | 'paid' | 'expired' | 'invalid'> {
    try {
      const response = await axios.get(
        `${this.btcPayServerUrl}/api/v1/stores/YourStoreId/invoices/${invoiceId}`,
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.status;
    } catch (error) {
      console.error('Erro ao verificar status da fatura:', error);
      throw new Error('Falha ao verificar status do pagamento');
    }
  }
}

export default new BitcoinService();
