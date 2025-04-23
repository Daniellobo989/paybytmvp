import React, { useState, useEffect } from 'react';

// Tipo para transação de escrow
interface EscrowTransaction {
  id: string;
  multisigAddress: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
  createdAt: string;
  updatedAt: string;
}

// Serviço de escrow simulado para o MVP
const escrowService = {
  // Criar transação de escrow
  createEscrow: async (buyerId: string, sellerId: string, amount: number): Promise<EscrowTransaction> => {
    // Simulando criação de escrow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const escrowId = `escrow_${Math.random().toString(36).substring(2, 10)}`;
    const multisigAddress = `bc1q${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const now = new Date().toISOString();
    
    return {
      id: escrowId,
      multisigAddress,
      buyerId,
      sellerId,
      amount,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
  },
  
  // Verificar status de financiamento
  checkFunding: async (escrowId: string): Promise<boolean> => {
    // Simulando verificação de financiamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.3; // 70% de chance de sucesso
  },
  
  // Liberar fundos para o vendedor
  releaseFunds: async (escrowId: string): Promise<boolean> => {
    // Simulando liberação de fundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.1; // 90% de chance de sucesso
  },
  
  // Reembolsar fundos para o comprador
  refundFunds: async (escrowId: string): Promise<boolean> => {
    // Simulando reembolso
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.1; // 90% de chance de sucesso
  },
  
  // Iniciar disputa
  initiateDispute: async (escrowId: string, reason: string): Promise<boolean> => {
    // Simulando início de disputa
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }
};

// Componente de gerenciamento de escrow
const EscrowManagerComponent: React.FC = () => {
  const [buyerId, setBuyerId] = useState<string>('buyer_123');
  const [sellerId, setSellerId] = useState<string>('seller_456');
  const [amount, setAmount] = useState<number>(5000000); // 5M sats = 0.05 BTC
  const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isReleasing, setIsReleasing] = useState<boolean>(false);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);
  const [isDisputing, setIsDisputing] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Criar nova transação de escrow
  const handleCreateEscrow = async () => {
    setIsCreating(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const newEscrow = await escrowService.createEscrow(buyerId, sellerId, amount);
      setEscrow(newEscrow);
      setSuccessMessage('Transação de escrow criada com sucesso!');
    } catch (err) {
      setError('Erro ao criar transação de escrow. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  // Verificar status de financiamento
  const handleCheckFunding = async () => {
    if (!escrow) return;
    
    setIsChecking(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const isFunded = await escrowService.checkFunding(escrow.id);
      
      if (isFunded) {
        setEscrow({
          ...escrow,
          status: 'funded',
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Financiamento confirmado! O escrow está financiado.');
      } else {
        setError('Financiamento não detectado. Verifique se o pagamento foi enviado para o endereço multisig.');
      }
    } catch (err) {
      setError('Erro ao verificar status de financiamento. Tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  // Liberar fundos para o vendedor
  const handleReleaseFunds = async () => {
    if (!escrow || escrow.status !== 'funded') return;
    
    setIsReleasing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const isReleased = await escrowService.releaseFunds(escrow.id);
      
      if (isReleased) {
        setEscrow({
          ...escrow,
          status: 'released',
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Fundos liberados com sucesso para o vendedor!');
      } else {
        setError('Erro ao liberar fundos. Tente novamente ou inicie uma disputa.');
      }
    } catch (err) {
      setError('Erro ao liberar fundos. Tente novamente.');
    } finally {
      setIsReleasing(false);
    }
  };

  // Reembolsar fundos para o comprador
  const handleRefundFunds = async () => {
    if (!escrow || escrow.status !== 'funded') return;
    
    setIsRefunding(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const isRefunded = await escrowService.refundFunds(escrow.id);
      
      if (isRefunded) {
        setEscrow({
          ...escrow,
          status: 'refunded',
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Fundos reembolsados com sucesso para o comprador!');
      } else {
        setError('Erro ao reembolsar fundos. Tente novamente ou inicie uma disputa.');
      }
    } catch (err) {
      setError('Erro ao reembolsar fundos. Tente novamente.');
    } finally {
      setIsRefunding(false);
    }
  };

  // Iniciar disputa
  const handleInitiateDispute = async () => {
    if (!escrow || !disputeReason.trim()) return;
    
    setIsDisputing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const isDisputed = await escrowService.initiateDispute(escrow.id, disputeReason);
      
      if (isDisputed) {
        setEscrow({
          ...escrow,
          status: 'disputed',
          updatedAt: new Date().toISOString()
        });
        setSuccessMessage('Disputa iniciada com sucesso! Um mediador irá analisar o caso.');
      } else {
        setError('Erro ao iniciar disputa. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao iniciar disputa. Tente novamente.');
    } finally {
      setIsDisputing(false);
    }
  };

  // Obter classe de status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Gerenciador de Escrow Multisig</h2>
      
      {!escrow ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Comprador
            </label>
            <input
              type="text"
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID do Vendedor
            </label>
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (em satoshis)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={handleCreateEscrow}
            disabled={isCreating || !buyerId || !sellerId || amount <= 0}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando escrow...
              </span>
            ) : (
              'Criar Transação de Escrow'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-3">Detalhes da Transação</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID da Transação:</span>
                <span className="text-sm font-medium text-gray-800">{escrow.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Endereço Multisig:</span>
                <div className="flex items-center">
                  <span className="text-sm font-mono text-gray-800 truncate max-w-xs">{escrow.multisigAddress}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(escrow.multisigAddress)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                    title="Copiar endereço"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Comprador:</span>
                <span className="text-sm text-gray-800">{escrow.buyerId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vendedor:</span>
                <span className="text-sm text-gray-800">{escrow.sellerId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Valor:</span>
                <span className="text-sm font-medium text-primary-500">{escrow.amount.toLocaleString()} sats</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(escrow.status)}`}>
                  {escrow.status === 'pending' && 'Pendente'}
                  {escrow.status === 'funded' && 'Financiado'}
                  {escrow.status === 'released' && 'Liberado'}
                  {escrow.status === 'refunded' && 'Reembolsado'}
                  {escrow.status === 'disputed' && 'Em Disputa'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Criado em:</span>
                <span className="text-sm text-gray-800">{formatDate(escrow.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Atualizado em:</span>
                <span className="text-sm text-gray-800">{formatDate(escrow.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {escrow.status === 'pending' && (
              <button
                onClick={handleCheckFunding}
                disabled={isChecking}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando financiamento...
                  </span>
                ) : (
                  'Verificar Financiamento'
                )}
              </button>
            )}
            
            {escrow.status === 'funded' && (
              <>
                <button
                  onClick={handleReleaseFunds}
                  disabled={isReleasing}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isReleasing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Liberando fundos...
                    </span>
                  ) : (
                    'Liberar Fundos para Vendedor'
                  )}
                </button>
                
                <button
                  onClick={handleRefundFunds}
                  disabled={isRefunding}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium 
(Content truncated due to size limit. Use line ranges to read in chunks)