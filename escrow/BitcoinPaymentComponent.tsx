import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Tipo para integração com Bitcoin
interface BitcoinIntegration {
  generateMultisigAddress: (buyerId: string, sellerId: string, amount: number) => Promise<string>;
  verifyPayment: (address: string, amount: number) => Promise<boolean>;
  releaseEscrow: (address: string, buyerSignature: string, sellerSignature: string) => Promise<string>;
  refundEscrow: (address: string, buyerSignature: string, sellerSignature: string) => Promise<string>;
  getAddressBalance: (address: string) => Promise<number>;
}

// Implementação simulada para o MVP
const bitcoinService: BitcoinIntegration = {
  generateMultisigAddress: async (buyerId: string, sellerId: string, amount: number) => {
    // Simulando geração de endereço multisig
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `bc1q${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  },
  
  verifyPayment: async (address: string, amount: number) => {
    // Simulando verificação de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.2; // 80% de chance de sucesso
  },
  
  releaseEscrow: async (address: string, buyerSignature: string, sellerSignature: string) => {
    // Simulando liberação de escrow
    await new Promise(resolve => setTimeout(resolve, 2500));
    return `tx${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  },
  
  refundEscrow: async (address: string, buyerSignature: string, sellerSignature: string) => {
    // Simulando reembolso de escrow
    await new Promise(resolve => setTimeout(resolve, 2500));
    return `tx${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  },
  
  getAddressBalance: async (address: string) => {
    // Simulando consulta de saldo
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.floor(Math.random() * 20000000);
  }
};

// Componente de integração com Bitcoin
const BitcoinPaymentComponent: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(10000000); // 10M sats = 0.1 BTC
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [error, setError] = useState<string>('');
  
  // Gerar endereço multisig
  const handleGenerateAddress = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const address = await bitcoinService.generateMultisigAddress('buyer123', 'seller456', amount);
      setAddress(address);
    } catch (err) {
      setError('Erro ao gerar endereço multisig. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Verificar pagamento
  const handleVerifyPayment = async () => {
    if (!address) return;
    
    setIsVerifying(true);
    setError('');
    
    try {
      const isConfirmed = await bitcoinService.verifyPayment(address, amount);
      setPaymentStatus(isConfirmed ? 'confirmed' : 'failed');
    } catch (err) {
      setError('Erro ao verificar pagamento. Tente novamente.');
      setPaymentStatus('failed');
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Integração com Bitcoin</h2>
      
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
      
      {!address ? (
        <button
          onClick={handleGenerateAddress}
          disabled={isGenerating}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando endereço...
            </span>
          ) : (
            'Gerar Endereço Multisig'
          )}
        </button>
      ) : (
        <div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-600 mb-2">Endereço Multisig:</p>
            <div className="flex items-center">
              <code className="text-sm bg-gray-100 p-2 rounded font-mono break-all">
                {address}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(address)}
                className="ml-2 text-primary-500 hover:text-primary-700"
                title="Copiar endereço"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Status do Pagamento:</p>
            <div className={`px-3 py-2 rounded-md ${
              paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {paymentStatus === 'pending' && 'Aguardando pagamento'}
              {paymentStatus === 'confirmed' && 'Pagamento confirmado'}
              {paymentStatus === 'failed' && 'Pagamento não detectado'}
            </div>
          </div>
          
          <button
            onClick={handleVerifyPayment}
            disabled={isVerifying}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando pagamento...
              </span>
            ) : (
              'Verificar Pagamento'
            )}
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Este componente demonstra a integração com Bitcoin para o sistema de escrow multisig do PayByt. No MVP, as transações são simuladas, mas em produção utilizarão a rede Bitcoin real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPaymentComponent;
