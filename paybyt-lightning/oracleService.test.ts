import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import oracleService from '../services/oracleService';
import chainlinkDeliveryAdapter from '../services/chainlinkDeliveryAdapter';
import ipfsProofAdapter from '../services/ipfsProofAdapter';
import smartContractAdapter from '../services/smartContractAdapter';

// Mock dos adaptadores
jest.mock('../services/chainlinkDeliveryAdapter');
jest.mock('../services/ipfsProofAdapter');
jest.mock('../services/smartContractAdapter');

describe('Oracle Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerTrackingCode', () => {
    it('deve registrar um código de rastreio corretamente', () => {
      // Chamar o método
      const status = oracleService.registerTrackingCode('BR123456789BR', 'Correios');

      // Verificar se o status foi criado corretamente
      expect(status).toHaveProperty('trackingCode', 'BR123456789BR');
      expect(status).toHaveProperty('carrier', 'Correios');
      expect(status).toHaveProperty('status', 'pending');
      expect(status).toHaveProperty('lastUpdate');
    });
  });

  describe('checkTrackingStatus', () => {
    it('deve verificar o status de um código de rastreio corretamente', async () => {
      // Registrar um código de rastreio
      oracleService.registerTrackingCode('BR123456789BR', 'Correios');

      // Mock do adaptador Chainlink
      (chainlinkDeliveryAdapter.checkDeliveryStatus as jest.Mock).mockResolvedValueOnce(false);

      // Chamar o método
      const status = await oracleService.checkTrackingStatus('BR123456789BR');

      // Verificar se o adaptador Chainlink foi chamado
      expect(chainlinkDeliveryAdapter.checkDeliveryStatus).toHaveBeenCalledWith('BR123456789BR', 'Correios');
      
      // Verificar se o status foi atualizado corretamente
      expect(status).toHaveProperty('trackingCode', 'BR123456789BR');
      expect(status).toHaveProperty('carrier', 'Correios');
    });

    it('deve lançar erro para código de rastreio não registrado', async () => {
      // Chamar o método com código não registrado
      await expect(oracleService.checkTrackingStatus('INVALID123')).rejects.toThrow();
    });
  });

  describe('confirmDeliveryOnChain', () => {
    it('deve confirmar entrega no blockchain quando o status for "delivered"', async () => {
      // Registrar um código de rastreio
      oracleService.registerTrackingCode('BR123456789BR', 'Correios');

      // Simular status de entrega
      const deliveryStatus = oracleService.getDeliveryStatus('BR123456789BR');
      if (deliveryStatus) {
        deliveryStatus.status = 'delivered';
        (oracleService as any).deliveryStatuses.set('BR123456789BR', deliveryStatus);
      }

      // Mock do adaptador de contrato inteligente
      (smartContractAdapter.confirmDelivery as jest.Mock).mockResolvedValueOnce('0xtxhash');

      // Chamar o método privado (para fins de teste)
      await (oracleService as any).confirmDeliveryOnChain('BR123456789BR');

      // Verificar se o adaptador de contrato inteligente foi chamado
      expect(smartContractAdapter.confirmDelivery).toHaveBeenCalledWith('BR123456789BR', expect.any(String));
    });
  });

  describe('registerDigitalDelivery', () => {
    it('deve registrar entrega de produto digital corretamente', () => {
      // Chamar o método
      const status = oracleService.registerDigitalDelivery(
        'product123',
        'XXXX-YYYY-ZZZZ',
        'https://example.com/download'
      );

      // Verificar se o status foi criado corretamente
      expect(status).toHaveProperty('productId', 'product123');
      expect(status).toHaveProperty('activationKey', 'XXXX-YYYY-ZZZZ');
      expect(status).toHaveProperty('downloadLink', 'https://example.com/download');
      expect(status).toHaveProperty('status', 'sent');
      expect(status).toHaveProperty('lastUpdate');
    });
  });

  describe('confirmDigitalDelivery', () => {
    it('deve confirmar recebimento de produto digital corretamente', () => {
      // Registrar entrega digital
      oracleService.registerDigitalDelivery('product123', 'XXXX-YYYY-ZZZZ');

      // Mock do adaptador de contrato inteligente
      (smartContractAdapter.confirmDelivery as jest.Mock).mockResolvedValueOnce('0xtxhash');

      // Chamar o método
      const status = oracleService.confirmDigitalDelivery('product123');

      // Verificar se o status foi atualizado corretamente
      expect(status).toHaveProperty('productId', 'product123');
      expect(status).toHaveProperty('status', 'confirmed');
    });

    it('deve lançar erro para produto não registrado', () => {
      // Chamar o método com produto não registrado
      expect(() => oracleService.confirmDigitalDelivery('INVALID123')).toThrow();
    });
  });

  describe('registerOpeningProof', () => {
    it('deve registrar prova de abertura via IPFS corretamente', async () => {
      // Registrar entrega digital
      oracleService.registerDigitalDelivery('product123', 'XXXX-YYYY-ZZZZ');

      // Mock do adaptador IPFS
      (ipfsProofAdapter.storeReadingProof as jest.Mock).mockResolvedValueOnce('ipfs://Qm123456789');

      // Chamar o método
      const ipfsHash = await oracleService.registerOpeningProof('product123', 'Conteúdo do produto');

      // Verificar se o adaptador IPFS foi chamado
      expect(ipfsProofAdapter.storeReadingProof).toHaveBeenCalledWith('product123', expect.any(String), 'Conteúdo do produto');
      
      // Verificar se o hash IPFS foi retornado
      expect(ipfsHash).toBe('ipfs://Qm123456789');

      // Verificar se o status foi atualizado
      const status = oracleService.getDigitalDeliveryStatus('product123');
      expect(status).toHaveProperty('readProof', 'ipfs://Qm123456789');
      expect(status).toHaveProperty('status', 'received');
    });
  });

  describe('verifyReadingProof', () => {
    it('deve verificar prova de leitura com assinatura digital corretamente', () => {
      // Registrar entrega digital
      oracleService.registerDigitalDelivery('product123', 'XXXX-YYYY-ZZZZ');

      // Mock do adaptador IPFS
      (ipfsProofAdapter.verifyReadingProof as jest.Mock).mockResolvedValueOnce(true);

      // Chamar o método
      const isValid = oracleService.verifyReadingProof('product123', 'assinatura-digital-valida');

      // Verificar se a verificação foi bem-sucedida
      expect(isValid).toBe(true);

      // Verificar se o status foi atualizado
      const status = oracleService.getDigitalDeliveryStatus('product123');
      expect(status).toHaveProperty('status', 'confirmed');
    });

    it('deve retornar falso para assinatura inválida', () => {
      // Registrar entrega digital
      oracleService.registerDigitalDelivery('product123', 'XXXX-YYYY-ZZZZ');

      // Mock do adaptador IPFS
      (ipfsProofAdapter.verifyReadingProof as jest.Mock).mockResolvedValueOnce(false);

      // Chamar o método com assinatura inválida
      const isValid = oracleService.verifyReadingProof('product123', 'assinatura-invalida');

      // Verificar se a verificação falhou
      expect(isValid).toBe(false);
    });
  });
});
