import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Tipo para transação Lightning
interface LightningTransaction {
  id: string;
  invoice: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'expired';
  created_at: string;
  expires_at: string;
}

// Implementação simulada do serviço Lightning
const lightningService = {
  generateInvoice: async (amount: number, description: string): Promise<string> => {
    // Simulando geração de invoice
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `lnbc${amount}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  },
  
  checkInvoiceStatus: async (invoice: string): Promise<'pending' | 'paid' | 'expired'> => {
    // Simulando verificação de status
    await new Promise(resolve => setTimeout(resolve, 1000));
    const random = Math.random();
    if (random < 0.7) return 'paid';
    if (random < 0.9) return 'pending';
    return 'expired';
  }
};

const LightningPaymentComponent: React.FC = () => {
  const [amount, setAmount] = useState<number>(100000); // 100k sats
  const [description, setDescription] = useState<string>('Pagamento via Lightning Network');
  const [invoice, setInvoice] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'expired' | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Gerar invoice
  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const invoice = await lightningService.generateInvoice(amount, description);
      setInvoice(invoice);
      setStatus('pending');
    } catch (err) {
      setError('Erro ao gerar invoice Lightning. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Verificar status do pagamento
  const handleCheckStatus = async () => {
    if (!invoice) return;
    
    setIsChecking(true);
    setError('');
    
    try {
      const status = await lightningService.checkInvoiceStatus(invoice);
      setStatus(status);
    } catch (err) {
      setError('Erro ao verificar status do pagamento. Tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  // Verificar status automaticamente a cada 5 segundos
  useEffect(() => {
    if (!invoice || status !== 'pending') return;
    
    const interval = setInterval(async () => {
      try {
        const newStatus = await lightningService.checkInvoiceStatus(invoice);
        setStatus(newStatus);
        
        if (newStatus !== 'pending') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [invoice, status]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pagamento via Lightning Network</h2>
      
      {!invoice ? (
        <div>
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
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={handleGenerateInvoice}
            disabled={isGenerating || amount <= 0}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando invoice...
              </span>
            ) : (
              'Gerar Invoice Lightning'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="mb-4 text-center">
              <div className="bg-white p-4 rounded-md inline-block mb-4">
                {/* Aqui seria um QR code real */}
                <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center">
                  <span className="text-gray-500 text-xs">QR Code da Invoice Lightning</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">Invoice Lightning:</p>
            <div className="flex items-center">
              <code className="text-sm bg-gray-100 p-2 rounded font-mono break-all">
                {invoice}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(invoice)}
                className="ml-2 text-accent-500 hover:text-accent-700"
                title="Copiar invoice"
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
              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              status === 'paid' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'pending' && 'Aguardando pagamento'}
              {status === 'paid' && 'Pagamento confirmado'}
              {status === 'expired' && 'Invoice expirada'}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setInvoice('');
                setStatus(null);
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-medium transition-colors"
            >
              Nova Invoice
            </button>
            
            <button
              onClick={handleCheckStatus}
              disabled={isChecking || status === 'paid' || status === 'expired'}
              className="flex-1 bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Verificar Status'
              )}
            </button>
          </div>
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
              A Lightning Network permite pagamentos instantâneos com taxas mínimas. No MVP, as transações são simuladas, mas em produção utilizarão a rede Lightning real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightningPaymentComponent;
