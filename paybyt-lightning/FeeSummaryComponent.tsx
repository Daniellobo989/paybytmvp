import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';

interface FeeSummaryProps {
  amount: string;
  transactionType: 'lightning' | 'onchain';
}

const FeeSummaryComponent: React.FC<FeeSummaryProps> = ({
  amount,
  transactionType
}) => {
  const [fees, setFees] = useState<{
    platformFee: string;
    networkFee: string;
    total: string;
  }>({
    platformFee: '0',
    networkFee: '0',
    total: '0'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const calculateFees = async () => {
      try {
        setLoading(true);
        
        // Calcular taxa da plataforma (1%)
        const platformFee = feeService.calculatePlatformFee(amount);
        
        // Calcular taxa de rede (mineração ou roteamento)
        let networkFee = '0';
        if (transactionType === 'onchain') {
          // Para transações on-chain, usar taxa de mineração
          networkFee = (await feeService.estimateOnChainFee()).toFixed(8);
        } else {
          // Para transações Lightning, usar taxa de roteamento
          networkFee = await feeService.estimateLightningRoutingFee(amount);
        }
        
        // Calcular total
        const total = (parseFloat(platformFee) + parseFloat(networkFee)).toFixed(8);
        
        setFees({
          platformFee,
          networkFee,
          total
        });
      } catch (error) {
        console.error('Erro ao calcular taxas:', error);
        setError('Falha ao calcular taxas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateFees();
  }, [amount, transactionType]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
        <p className="ml-2 text-sm">Calculando taxas...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm" role="alert">
        {error}
      </div>
    );
  }
  
  return (
    <div className="fee-summary-container bg-gray-50 rounded p-4 text-sm">
      <h4 className="font-bold text-gray-700 mb-2">Resumo de Taxas</h4>
      
      <div className="fee-details space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Valor da transação:</span>
          <span className="font-medium">{amount} BTC</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Taxa da plataforma (1%):</span>
          <span className="font-medium">{fees.platformFee} BTC</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">
            {transactionType === 'onchain' ? 'Taxa de mineração:' : 'Taxa de roteamento Lightning:'}
          </span>
          <span className="font-medium">{fees.networkFee} BTC</span>
        </div>
        
        <div className="border-t border-gray-200 pt-1 mt-1">
          <div className="flex justify-between font-bold">
            <span>Total de taxas:</span>
            <span>{fees.total} BTC</span>
          </div>
          
          <div className="flex justify-between font-bold text-blue-700">
            <span>Valor total:</span>
            <span>{(parseFloat(amount) + parseFloat(fees.total)).toFixed(8)} BTC</span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        A taxa da plataforma (1%) é utilizada para manutenção da rede PayByt, incluindo servidores, 
        APIs de blockchain, monitoramento e segurança.
      </p>
    </div>
  );
};

export default FeeSummaryComponent;
