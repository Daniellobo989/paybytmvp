import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import feeService from '../services/feeService';
import feeDistributionService from '../services/feeDistributionService';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Fee Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePlatformFee', () => {
    it('deve calcular corretamente a taxa de 1% da plataforma', () => {
      // Testar diferentes valores
      const testCases = [
        { amount: '1.0', expectedFee: '0.01' },
        { amount: '0.5', expectedFee: '0.005' },
        { amount: '0.01', expectedFee: '0.0001' },
        { amount: '10.0', expectedFee: '0.1' }
      ];

      for (const testCase of testCases) {
        const fee = feeService.calculatePlatformFee(testCase.amount);
        expect(parseFloat(fee)).toBeCloseTo(parseFloat(testCase.expectedFee), 8);
      }
    });

    it('deve aplicar a taxa mínima quando o valor calculado for menor', () => {
      // Configuração atual do serviço
      const config = feeService.getFeeConfig();
      const minFee = parseFloat(config.minPlatformFee);

      // Valor muito pequeno para gerar taxa abaixo do mínimo
      const smallAmount = (minFee / 2).toString();
      
      // Calcular taxa
      const fee = feeService.calculatePlatformFee(smallAmount);
      
      // Verificar se a taxa mínima foi aplicada
      expect(parseFloat(fee)).toBe(minFee);
    });
  });

  describe('estimateOnChainFee', () => {
    it('deve estimar corretamente a taxa de mineração on-chain', async () => {
      // Mock da resposta da API de taxas
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          fastestFee: 100,
          halfHourFee: 50,
          hourFee: 20
        }
      });

      // Chamar o método
      const fee = await feeService.estimateOnChainFee();

      // Verificar se o axios.get foi chamado corretamente
      expect(mockedAxios.get).toHaveBeenCalled();
      
      // Verificar se a taxa foi calculada corretamente
      // Para uma transação típica com 1 input e 2 outputs:
      // (1 * 148) + (2 * 34) + 10 = 226 bytes
      // 226 * 20 sat/byte = 4520 satoshis = 0.0000452 BTC
      expect(fee).toBeCloseTo(0.0000452, 8);
    });

    it('deve usar o valor de satoshis por byte fornecido', async () => {
      // Chamar o método com valor específico
      const fee = await feeService.estimateOnChainFee(30);
      
      // Verificar se a taxa foi calculada corretamente
      // Para uma transação típica com 1 input e 2 outputs:
      // (1 * 148) + (2 * 34) + 10 = 226 bytes
      // 226 * 30 sat/byte = 6780 satoshis = 0.0000678 BTC
      expect(fee).toBeCloseTo(0.0000678, 8);
    });
  });

  describe('estimateLightningRoutingFee', () => {
    it('deve estimar corretamente a taxa de roteamento Lightning', async () => {
      // Testar diferentes valores
      const testCases = [
        { amount: '1.0', expectedFee: '0.001' }, // 0.1% de 1.0
        { amount: '0.1', expectedFee: '0.0001' }, // 0.1% de 0.1
        { amount: '0.001', expectedFee: '0.000001' } // 0.1% de 0.001
      ];

      for (const testCase of testCases) {
        const fee = await feeService.estimateLightningRoutingFee(testCase.amount);
        expect(parseFloat(fee)).toBeCloseTo(parseFloat(testCase.expectedFee), 8);
      }
    });

    it('deve aplicar o valor mínimo de 1 satoshi quando necessário', async () => {
      // Valor muito pequeno para gerar taxa abaixo de 1 satoshi
      const smallAmount = '0.0000001';
      
      // Calcular taxa
      const fee = await feeService.estimateLightningRoutingFee(smallAmount);
      
      // Verificar se o mínimo de 1 satoshi foi aplicado
      expect(parseFloat(fee)).toBe(0.00000001);
    });
  });

  describe('recordFeeCollection', () => {
    it('deve registrar corretamente a cobrança de taxa', () => {
      // Chamar o método
      const record = feeService.recordFeeCollection(
        'tx123',
        '1.0',
        '0.01',
        'platform'
      );

      // Verificar se o registro foi criado corretamente
      expect(record).toHaveProperty('transactionId', 'tx123');
      expect(record).toHaveProperty('amount', '1.0');
      expect(record).toHaveProperty('feeAmount', '0.01');
      expect(record).toHaveProperty('feeType', 'platform');
      expect(record).toHaveProperty('timestamp');
    });
  });
});

describe('Fee Distribution Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('distributeFee', () => {
    it('deve distribuir corretamente a taxa entre os diferentes destinos', () => {
      // Chamar o método
      const record = feeDistributionService.distributeFee('tx123', '0.01');

      // Verificar se o registro foi criado corretamente
      expect(record).toHaveProperty('transactionId', 'tx123');
      expect(record).toHaveProperty('totalFeeAmount', '0.01');
      
      // Verificar se os valores foram distribuídos corretamente
      // 40% para plataforma
      expect(parseFloat(record.platformAmount)).toBeCloseTo(0.004, 8);
      // 30% para desenvolvimento
      expect(parseFloat(record.developmentAmount)).toBeCloseTo(0.003, 8);
      // 20% para segurança
      expect(parseFloat(record.securityAmount)).toBeCloseTo(0.002, 8);
      // 10% para comunidade
      expect(parseFloat(record.communityAmount)).toBeCloseTo(0.001, 8);
    });
  });

  describe('updateDistributionConfig', () => {
    it('deve atualizar corretamente a configuração de distribuição', () => {
      // Nova configuração
      const newConfig = {
        platformPercentage: 50,
        developmentPercentage: 25,
        securityPercentage: 15,
        communityPercentage: 10
      };

      // Atualizar configuração
      const updatedConfig = feeDistributionService.updateDistributionConfig(newConfig);

      // Verificar se a configuração foi atualizada corretamente
      expect(updatedConfig).toEqual(newConfig);
    });

    it('deve lançar erro se os percentuais não somarem 100%', () => {
      // Configuração inválida
      const invalidConfig = {
        platformPercentage: 50,
        developmentPercentage: 30,
        securityPercentage: 30,
        communityPercentage: 10
      };

      // Tentar atualizar configuração
      expect(() => feeDistributionService.updateDistributionConfig(invalidConfig)).toThrow();
    });
  });

  describe('generateDistributionReport', () => {
    it('deve gerar relatório de distribuição corretamente', () => {
      // Registrar algumas distribuições
      feeDistributionService.distributeFee('tx1', '0.01');
      feeDistributionService.distributeFee('tx2', '0.02');
      
      // Data atual
      const now = new Date();
      const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // 1 dia atrás
      const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 1 dia à frente
      
      // Gerar relatório
      const report = feeDistributionService.generateDistributionReport(startDate, endDate);
      
      // Verificar se o relatório foi gerado corretamente
      expect(report).toHaveProperty('totalFees');
      expect(report).toHaveProperty('platformTotal');
      expect(report).toHaveProperty('developmentTotal');
      expect(report).toHaveProperty('securityTotal');
      expect(report).toHaveProperty('communityTotal');
      expect(report).toHaveProperty('recordCount', 2);
      
      // Verificar se os totais estão corretos
      expect(parseFloat(report.totalFees)).toBeCloseTo(0.03, 8); // 0.01 + 0.02
    });
  });
});
