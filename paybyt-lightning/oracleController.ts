import { Request, Response } from 'express';
import oracleService, { DeliveryStatus, DigitalDeliveryStatus } from '../services/oracleService';

// Controlador para operações do sistema de oráculos
class OracleController {
  // Registrar um novo código de rastreio para monitoramento
  async registerTrackingCode(req: Request, res: Response): Promise<void> {
    try {
      const { trackingCode, carrier } = req.body;
      
      // Validar parâmetros
      if (!trackingCode || !carrier) {
        res.status(400).json({ error: 'Parâmetros inválidos. trackingCode e carrier são obrigatórios.' });
        return;
      }
      
      // Registrar código de rastreio
      const status = oracleService.registerTrackingCode(trackingCode, carrier);
      
      res.status(201).json(status);
    } catch (error) {
      console.error('Erro ao registrar código de rastreio:', error);
      res.status(500).json({ error: 'Falha ao registrar código de rastreio' });
    }
  }

  // Verificar status atual de um código de rastreio
  async checkTrackingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { trackingCode } = req.params;
      
      if (!trackingCode) {
        res.status(400).json({ error: 'Código de rastreio é obrigatório' });
        return;
      }
      
      const status = await oracleService.checkTrackingStatus(trackingCode);
      
      res.status(200).json(status);
    } catch (error) {
      console.error('Erro ao verificar status de rastreio:', error);
      res.status(500).json({ error: 'Falha ao verificar status de rastreio' });
    }
  }

  // Obter status de entrega pelo código de rastreio
  async getDeliveryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { trackingCode } = req.params;
      
      if (!trackingCode) {
        res.status(400).json({ error: 'Código de rastreio é obrigatório' });
        return;
      }
      
      const status = oracleService.getDeliveryStatus(trackingCode);
      
      if (!status) {
        res.status(404).json({ error: 'Status de entrega não encontrado' });
        return;
      }
      
      res.status(200).json(status);
    } catch (error) {
      console.error('Erro ao obter status de entrega:', error);
      res.status(500).json({ error: 'Falha ao obter status de entrega' });
    }
  }

  // Gerar QR code para confirmação de entrega
  async generateDeliveryQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { trackingCode } = req.params;
      
      if (!trackingCode) {
        res.status(400).json({ error: 'Código de rastreio é obrigatório' });
        return;
      }
      
      const qrCodeUrl = await oracleService.generateDeliveryQRCode(trackingCode);
      
      res.status(200).json({ trackingCode, qrCodeUrl });
    } catch (error) {
      console.error('Erro ao gerar QR code para confirmação de entrega:', error);
      res.status(500).json({ error: 'Falha ao gerar QR code para confirmação de entrega' });
    }
  }

  // Processar confirmação de entrega via QR code
  async processQRCodeConfirmation(req: Request, res: Response): Promise<void> {
    try {
      const { trackingCode, confirmationCode } = req.body;
      
      if (!trackingCode || !confirmationCode) {
        res.status(400).json({ error: 'Parâmetros inválidos. trackingCode e confirmationCode são obrigatórios.' });
        return;
      }
      
      const success = await oracleService.processQRCodeConfirmation(trackingCode, confirmationCode);
      
      if (!success) {
        res.status(400).json({ error: 'Código de confirmação inválido' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Entrega confirmada com sucesso' });
    } catch (error) {
      console.error('Erro ao processar confirmação via QR code:', error);
      res.status(500).json({ error: 'Falha ao processar confirmação de entrega' });
    }
  }

  // Registrar entrega de produto digital
  async registerDigitalDelivery(req: Request, res: Response): Promise<void> {
    try {
      const { productId, activationKey, downloadLink } = req.body;
      
      if (!productId) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }
      
      const status = oracleService.registerDigitalDelivery(productId, activationKey, downloadLink);
      
      res.status(201).json(status);
    } catch (error) {
      console.error('Erro ao registrar entrega digital:', error);
      res.status(500).json({ error: 'Falha ao registrar entrega digital' });
    }
  }

  // Confirmar recebimento de produto digital
  async confirmDigitalDelivery(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      if (!productId) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }
      
      const status = oracleService.confirmDigitalDelivery(productId);
      
      res.status(200).json(status);
    } catch (error) {
      console.error('Erro ao confirmar entrega digital:', error);
      res.status(500).json({ error: 'Falha ao confirmar entrega digital' });
    }
  }

  // Obter status de entrega digital pelo ID do produto
  async getDigitalDeliveryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      if (!productId) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }
      
      const status = oracleService.getDigitalDeliveryStatus(productId);
      
      if (!status) {
        res.status(404).json({ error: 'Status de entrega digital não encontrado' });
        return;
      }
      
      res.status(200).json(status);
    } catch (error) {
      console.error('Erro ao obter status de entrega digital:', error);
      res.status(500).json({ error: 'Falha ao obter status de entrega digital' });
    }
  }

  // Registrar prova de abertura via IPFS
  async registerOpeningProof(req: Request, res: Response): Promise<void> {
    try {
      const { productId, proofData } = req.body;
      
      if (!productId || !proofData) {
        res.status(400).json({ error: 'Parâmetros inválidos. productId e proofData são obrigatórios.' });
        return;
      }
      
      const ipfsHash = await oracleService.registerOpeningProof(productId, proofData);
      
      res.status(200).json({ productId, ipfsHash });
    } catch (error) {
      console.error('Erro ao registrar prova de abertura:', error);
      res.status(500).json({ error: 'Falha ao registrar prova de abertura' });
    }
  }

  // Verificar prova de leitura com assinatura digital
  async verifyReadingProof(req: Request, res: Response): Promise<void> {
    try {
      const { productId, signature } = req.body;
      
      if (!productId || !signature) {
        res.status(400).json({ error: 'Parâmetros inválidos. productId e signature são obrigatórios.' });
        return;
      }
      
      const isValid = oracleService.verifyReadingProof(productId, signature);
      
      res.status(200).json({ productId, isValid });
    } catch (error) {
      console.error('Erro ao verificar prova de leitura:', error);
      res.status(500).json({ error: 'Falha ao verificar prova de leitura' });
    }
  }
}

export default new OracleController();
