import axios from 'axios';

// Interface para configuração do sistema de taxas
export interface FeeConfig {
  platformFeePercentage: number; // Taxa da plataforma em porcentagem (ex: 1.0 para 1%)
  minPlatformFee: string; // Taxa mínima da plataforma em BTC (ex: "0.00001")
  minerFeeEstimateUrl: string; // URL para estimativa de taxa de mineração
}

// Interface para registro de taxas
export interface FeeRecord {
  transactionId: string;
  amount: string;
  feeAmount: string;
  feeType: 'platform' | 'mining' | 'routing';
  timestamp: string;
}

// Classe para gerenciar o sistema de taxas
class FeeService {
  private config: FeeConfig;
  private feeRecords: FeeRecord[];
  private storageKey = 'paybyt_fee_records';

  constructor() {
    // Configuração padrão do sistema de taxas
    this.config = {
      platformFeePercentage: 1.0, // 1% de taxa da plataforma
      minPlatformFee: "0.00001", // 0.00001 BTC (1000 satoshis) como taxa mínima
      minerFeeEstimateUrl: "https://mempool.space/api/v1/fees/recommended"
    };
    
    this.feeRecords = [];
    this.loadFromStorage();
  }

  // Carregar registros de taxas do armazenamento local
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem(this.storageKey);
      if (storedRecords) {
        this.feeRecords = JSON.parse(storedRecords);
      }
    }
  }

  // Salvar registros de taxas no armazenamento local
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.feeRecords));
    }
  }

  // Calcular taxa da plataforma (1% do valor)
  calculatePlatformFee(amount: string): string {
    const amountValue = parseFloat(amount);
    const feeValue = amountValue * (this.config.platformFeePercentage / 100);
    
    // Garantir que a taxa seja pelo menos o mínimo configurado
    const minFee = parseFloat(this.config.minPlatformFee);
    const finalFee = Math.max(feeValue, minFee);
    
    return finalFee.toFixed(8); // 8 casas decimais para Bitcoin
  }

  // Estimar taxa de mineração para transação on-chain
  async estimateOnChainFee(satoshisPerByte?: number, inputCount = 1, outputCount = 2): Promise<number> {
    try {
      if (!satoshisPerByte) {
        // Obter estimativa de taxa da API
        const response = await axios.get(this.config.minerFeeEstimateUrl);
        
        // Usar taxa para confirmação em ~30 minutos (economia)
        satoshisPerByte = response.data.hourFee;
      }
      
      // Calcular tamanho estimado da transação em bytes
      // P2SH: ~148 bytes por input, ~34 bytes por output, ~10 bytes fixos
      const txSize = (inputCount * 148) + (outputCount * 34) + 10;
      
      // Calcular taxa total em satoshis
      const feeSatoshis = txSize * satoshisPerByte;
      
      // Converter para BTC
      return feeSatoshis / 100000000;
    } catch (error) {
      console.error('Erro ao estimar taxa de mineração:', error);
      
      // Valor padrão em caso de falha (10 sat/byte para uma transação típica)
      const defaultTxSize = (inputCount * 148) + (outputCount * 34) + 10;
      return (defaultTxSize * 10) / 100000000;
    }
  }

  // Estimar taxa de roteamento para Lightning Network
  async estimateLightningRoutingFee(amount: string): Promise<string> {
    // Taxas de roteamento são geralmente muito menores que on-chain
    // Estimativa simplificada: 0.1% ou 1 satoshi, o que for maior
    const amountValue = parseFloat(amount);
    const routingFeeValue = Math.max(amountValue * 0.001, 0.00000001);
    return routingFeeValue.toFixed(8);
  }

  // Registrar cobrança de taxa
  recordFeeCollection(transactionId: string, amount: string, feeAmount: string, feeType: 'platform' | 'mining' | 'routing'): FeeRecord {
    const record: FeeRecord = {
      transactionId,
      amount,
      feeAmount,
      feeType,
      timestamp: new Date().toISOString()
    };
    
    this.feeRecords.push(record);
    this.saveToStorage();
    
    return record;
  }

  // Gerar relatório de taxas por período
  generateFeeReport(startDate: string, endDate: string): {
    platformFees: { count: number; total: number };
    miningFees: { count: number; total: number };
    routingFees: { count: number; total: number };
  } {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    // Filtrar registros pelo período
    const filteredRecords = this.feeRecords.filter(record => {
      const recordTime = new Date(record.timestamp).getTime();
      return recordTime >= start && recordTime <= end;
    });
    
    // Calcular totais por tipo de taxa
    const report = {
      platformFees: {
        count: 0,
        total: 0
      },
      miningFees: {
        count: 0,
        total: 0
      },
      routingFees: {
        count: 0,
        total: 0
      }
    };
    
    filteredRecords.forEach(record => {
      switch (record.feeType) {
        case 'platform':
          report.platformFees.count++;
          report.platformFees.total += parseFloat(record.feeAmount);
          break;
        case 'mining':
          report.miningFees.count++;
          report.miningFees.total += parseFloat(record.feeAmount);
          break;
        case 'routing':
          report.routingFees.count++;
          report.routingFees.total += parseFloat(record.feeAmount);
          break;
      }
    });
    
    return report;
  }

  // Obter todos os registros de taxas
  getAllFeeRecords(): FeeRecord[] {
    return this.feeRecords;
  }

  // Obter registros de taxas por tipo
  getFeeRecordsByType(feeType: 'platform' | 'mining' | 'routing'): FeeRecord[] {
    return this.feeRecords.filter(record => record.feeType === feeType);
  }

  // Obter configuração atual do sistema de taxas
  getFeeConfig(): FeeConfig {
    return this.config;
  }

  // Atualizar configuração do sistema de taxas
  updateFeeConfig(newConfig: Partial<FeeConfig>): FeeConfig {
    this.config = {
      ...this.config,
      ...newConfig
    };
    return this.config;
  }
}

export default new FeeService();
