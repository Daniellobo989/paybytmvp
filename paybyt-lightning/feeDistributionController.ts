import { Request, Response } from 'express';
import feeDistributionService, { FeeDistributionConfig, FeeDistributionRecord } from '../services/feeDistributionService';

// Controlador para operações do sistema de distribuição de taxas
class FeeDistributionController {
  // Distribuir taxa da plataforma entre os diferentes destinos
  async distributeFee(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId, totalFeeAmount } = req.body;
      
      if (!transactionId || !totalFeeAmount) {
        res.status(400).json({ 
          error: 'Parâmetros inválidos. transactionId e totalFeeAmount são obrigatórios.' 
        });
        return;
      }
      
      const record = feeDistributionService.distributeFee(transactionId, totalFeeAmount);
      
      res.status(201).json(record);
    } catch (error) {
      console.error('Erro ao distribuir taxa da plataforma:', error);
      res.status(500).json({ error: 'Falha ao distribuir taxa da plataforma' });
    }
  }

  // Obter configuração atual de distribuição de taxas
  getDistributionConfig(req: Request, res: Response): void {
    try {
      const config = feeDistributionService.getDistributionConfig();
      res.status(200).json(config);
    } catch (error) {
      console.error('Erro ao obter configuração de distribuição de taxas:', error);
      res.status(500).json({ error: 'Falha ao obter configuração de distribuição de taxas' });
    }
  }

  // Atualizar configuração de distribuição de taxas
  updateDistributionConfig(req: Request, res: Response): void {
    try {
      const { platformPercentage, developmentPercentage, securityPercentage, communityPercentage } = req.body;
      
      const newConfig: Partial<FeeDistributionConfig> = {};
      
      if (platformPercentage !== undefined) {
        newConfig.platformPercentage = parseFloat(platformPercentage);
      }
      
      if (developmentPercentage !== undefined) {
        newConfig.developmentPercentage = parseFloat(developmentPercentage);
      }
      
      if (securityPercentage !== undefined) {
        newConfig.securityPercentage = parseFloat(securityPercentage);
      }
      
      if (communityPercentage !== undefined) {
        newConfig.communityPercentage = parseFloat(communityPercentage);
      }
      
      const updatedConfig = feeDistributionService.updateDistributionConfig(newConfig);
      
      res.status(200).json(updatedConfig);
    } catch (error) {
      console.error('Erro ao atualizar configuração de distribuição de taxas:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Falha ao atualizar configuração de distribuição de taxas' 
      });
    }
  }

  // Obter todos os registros de distribuição de taxas
  getAllDistributionRecords(req: Request, res: Response): void {
    try {
      const records = feeDistributionService.getAllDistributionRecords();
      res.status(200).json(records);
    } catch (error) {
      console.error('Erro ao obter registros de distribuição de taxas:', error);
      res.status(500).json({ error: 'Falha ao obter registros de distribuição de taxas' });
    }
  }

  // Obter registros de distribuição de taxas por período
  getDistributionRecordsByPeriod(req: Request, res: Response): void {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Datas de início e fim são obrigatórias' });
        return;
      }
      
      const records = feeDistributionService.getDistributionRecordsByPeriod(
        startDate as string, 
        endDate as string
      );
      
      res.status(200).json(records);
    } catch (error) {
      console.error('Erro ao obter registros de distribuição de taxas por período:', error);
      res.status(500).json({ error: 'Falha ao obter registros de distribuição de taxas por período' });
    }
  }

  // Gerar relatório de distribuição de taxas por período
  generateDistributionReport(req: Request, res: Response): void {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ error: 'Datas de início e fim são obrigatórias' });
        return;
      }
      
      const report = feeDistributionService.generateDistributionReport(
        startDate as string, 
        endDate as string
      );
      
      res.status(200).json(report);
    } catch (error) {
      console.error('Erro ao gerar relatório de distribuição de taxas:', error);
      res.status(500).json({ error: 'Falha ao gerar relatório de distribuição de taxas' });
    }
  }
}

export default new FeeDistributionController();
