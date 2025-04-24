import { Request, Response } from 'express';
import feeService, { FeeRecord, FeeConfig } from '../services/feeService';

// Controlador para operações do sistema de taxas
class FeeController {
  // Calcular taxa da plataforma
  calculatePlatformFee(req: Request, res: Response): void {
    try {
      const { amount } = req.query;
      
      if (!amount) {
        res.status(400).json({ error: 'Valor da transação é obrigatório' });
        return;
      }
      
      const fee = feeService.calculatePlatformFee(amount as string);
      
      res.status(200).json({ amount, platformFee: fee });
    } catch (error) {
      console.error('Erro ao calcular taxa da plataforma:', error);
      res.status(500).json({ error: 'Falha ao calcular taxa da plataforma' });
    }
  }

  // Estimar taxa de mineração para transação on-chain
  async estimateOnChainFee(req: Request, res: Response): Promise<void> {
    try {
      const { satoshisPerByte, inputCount, outputCount } = req.query;
      
      const fee = await feeService.estimateOnChainFee(
        satoshisPerByte ? parseInt(satoshisPerByte as string) : undefined,
        inputCount ? parseInt(inputCount as string) : 1,
        outputCount ? parseInt(outputCount as string) : 2
      );
      
      res.status(200).json({ miningFee: fee });
    } catch (error) {
      console.error('Erro ao estimar taxa de mineração:', error);
      res.status(500).json({ error: 'Falha ao estimar taxa de mineração' });
    }
  }

  // Estimar taxa de roteamento para Lightning Network
  async estimateLightningRoutingFee(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.query;
      
      if (!amount) {
        res.status(400).json({ error: 'Valor da transação é obrigatório' });
        return;
      }
      
      const fee = await feeService.estimateLightningRoutingFee(amount as string);
      
      res.status(200).json({ amount, routingFee: fee });
    } catch (error) {
      console.error('Erro ao estimar taxa de roteamento Lightning:', error);
      res.status(500).json({ error: 'Falha ao estimar taxa de roteamento Lightning' });
    }
  }

  // Registrar cobrança de taxa
  async recordFeeCollection(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId, amount, feeAmount, feeType } = req.body;
      
      if (!transactionId || !amount || !feeAmount || !feeType) {
        res.status(400).json({ 
          error: 'Parâmetros inválidos. transactionId, amount, feeAmount e feeType são obrigatórios.' 
        });
        return;
      }
      
      if (!['platform', 'mining', 'routing'].includes(feeType)) {
        res.status(400).json({ error: 'Tipo de taxa inválido. Deve ser platform, mining ou routing.' });
        return;
      }
      
      const record = feeService.recordFeeCollection(
        transactionId,
        amount,
        feeAmount,
        feeType as 'platform' | 'mining' | 'routing'
      );
      
      res.status(201).json(record);
    } catch (error) {
      console.error('Erro ao registrar cobrança de taxa:', error);
      res.status(500).json({ error: 'Falha ao registrar cobrança de taxa' });
    }
  }

  // Gerar relatório de taxas por período
  async generateFeeReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Datas de início e fim são obrigatórias' });
        return;
      }
      
      const report = feeService.generateFeeReport(startDate as string, endDate as string);
      
      res.status(200).json(report);
    } catch (error) {
      console.error('Erro ao gerar relatório de taxas:', error);
      res.status(500).json({ error: 'Falha ao gerar relatório de taxas' });
    }
  }

  // Obter todos os registros de taxas
  getAllFeeRecords(req: Request, res: Response): void {
    try {
      const records = feeService.getAllFeeRecords();
      res.status(200).json(records);
    } catch (error) {
      console.error('Erro ao obter registros de taxas:', error);
      res.status(500).json({ error: 'Falha ao obter registros de taxas' });
    }
  }

  // Obter registros de taxas por tipo
  getFeeRecordsByType(req: Request, res: Response): void {
    try {
      const { feeType } = req.params;
      
      if (!feeType || !['platform', 'mining', 'routing'].includes(feeType)) {
        res.status(400).json({ error: 'Tipo de taxa inválido. Deve ser platform, mining ou routing.' });
        return;
      }
      
      const records = feeService.getFeeRecordsByType(feeType as 'platform' | 'mining' | 'routing');
      
      res.status(200).json(records);
    } catch (error) {
      console.error('Erro ao obter registros de taxas por tipo:', error);
      res.status(500).json({ error: 'Falha ao obter registros de taxas por tipo' });
    }
  }

  // Obter configuração atual do sistema de taxas
  getFeeConfig(req: Request, res: Response): void {
    try {
      const config = feeService.getFeeConfig();
      res.status(200).json(config);
    } catch (error) {
      console.error('Erro ao obter configuração de taxas:', error);
      res.status(500).json({ error: 'Falha ao obter configuração de taxas' });
    }
  }

  // Atualizar configuração do sistema de taxas
  updateFeeConfig(req: Request, res: Response): void {
    try {
      const { platformFeePercentage, minPlatformFee, minerFeeEstimateUrl } = req.body;
      
      const newConfig: Partial<FeeConfig> = {};
      
      if (platformFeePercentage !== undefined) {
        newConfig.platformFeePercentage = parseFloat(platformFeePercentage);
      }
      
      if (minPlatformFee !== undefined) {
        newConfig.minPlatformFee = minPlatformFee;
      }
      
      if (minerFeeEstimateUrl !== undefined) {
        newConfig.minerFeeEstimateUrl = minerFeeEstimateUrl;
      }
      
      const updatedConfig = feeService.updateFeeConfig(newConfig);
      
      res.status(200).json(updatedConfig);
    } catch (error) {
      console.error('Erro ao atualizar configuração de taxas:', error);
      res.status(500).json({ error: 'Falha ao atualizar configuração de taxas' });
    }
  }
}

export default new FeeController();
