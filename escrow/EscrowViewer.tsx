import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface EscrowData {
  escrowId: string;
  escrowAddress: string;
  buyerAddress: string;
  sellerAddress: string;
  amount: string;
  description: string;
  timelock: string;
  status: 'funded' | 'in_progress' | 'completed' | 'refunded' | 'disputed';
  createdAt: string;
}

const EscrowViewer: React.FC = () => {
  const [escrowId, setEscrowId] = useState('');
  const [loading, setLoading] = useState(false);
  const [escrow, setEscrow] = useState<EscrowData | null>(null);
  const [error, setError] = useState('');

  // Função simulada para buscar dados do escrow
  const fetchEscrowData = (id: string) => {
    setLoading(true);
    setError('');
    
    // Simulação de chamada de API
    setTimeout(() => {
      if (id.startsWith('ESC')) {
        // Mock de dados de escrow
        const mockEscrow: EscrowData = {
          escrowId: id,
          escrowAddress: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          buyerAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
          sellerAddress: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9',
          amount: '0.05',
          description: 'Compra de laptop MacBook Pro 2025',
          timelock: '48',
          status: 'funded',
          createdAt: new Date().toISOString()
        };
        
        setEscrow(mockEscrow);
        setLoading(false);
      } else {
        setError('Escrow não encontrado. Verifique o ID e tente novamente.');
        setEscrow(null);
        setLoading(false);
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (escrowId.trim()) {
      fetchEscrowData(escrowId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, text: string }> = {
      funded: { color: 'bg-yellow-100 text-yellow-800', text: 'Financiado' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: 'Em Andamento' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Concluído' },
      refunded: { color: 'bg-gray-100 text-gray-800', text: 'Reembolsado' },
      disputed: { color: 'bg-red-100 text-red-800', text: 'Em Disputa' }
    };
    
    const { color, text } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: 'Desconhecido' };
    
    return (
      <span className={`${color} px-3 py-1 rounded-full text-sm font-medium`}>
        {text}
      </span>
    );
  };

  const handleAction = (action: 'release' | 'refund' | 'dispute') => {
    if (!escrow) return;
    
    setLoading(true);
    
    // Simulação de chamada de API
    setTimeout(() => {
      let newStatus: EscrowData['status'] = escrow.status;
      
      switch (action) {
        case 'release':
          newStatus = 'completed';
          break;
        case 'refund':
          newStatus = 'refunded';
          break;
        case 'dispute':
          newStatus = 'disputed';
          break;
      }
      
      setEscrow({
        ...escrow,
        status: newStatus
      });
      
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div>
      {!escrow ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Visualizar Escrow Existente</h2>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={escrowId}
                onChange={(e) => setEscrowId(e.target.value)}
                className="input flex-grow"
                placeholder="Digite o ID do escrow (ex: ESC12345)"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary md:w-auto"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar Escrow'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Como visualizar um escrow?</h3>
            <p className="mb-4">
              Para visualizar os detalhes de um escrow existente, você precisa do ID do escrow.
              O ID é fornecido no momento da criação do escrow e também é enviado por e-mail para as partes envolvidas.
            </p>
            <p>
              Digite o ID do escrow no formato <code className="bg-gray-200 px-2 py-1 rounded">ESC12345</code> e clique em "Buscar Escrow".
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Detalhes do Escrow</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Status:</span>
              {getStatusBadge(escrow.status)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold mb-2">Endereço do Escrow Multisig</h3>
                <div className="flex items-center">
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm break-all">
                    {escrow.escrowAddress}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(escrow.escrowAddress)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={escrow.escrowAddress} size={120} />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Detalhes da Transação</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID do Escrow</p>
                  <p className="font-medium">{escrow.escrowId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Criação</p>
                  <p className="font-medium">{new Date(escrow.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comprador</p>
                  <p className="font-medium truncate">{escrow.buyerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendedor</p>
                  <p className="font-medium truncate">{escrow.sellerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium">₿ {escrow.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timelock</p>
                  <p className="font-medium">{escrow.timelock} horas</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="font-medium">{escrow.description}</p>
              </div>
            </div>
          </div>
          
          {escrow.status === 'funded' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Este escrow está financiado e aguardando a conclusão da transação. 
                    O comprador deve liberar os fundos após receber o produto/serviço.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {escrow.status === 'completed' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Este escrow foi concluído com sucesso! Os fundos foram liberados para o vendedor.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {escrow.status === 'refunded' && (
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Este escrow foi reembolsado. Os fundos foram devolvidos ao comprador.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {escrow.status === 'disputed' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Este escrow está em disputa. Um mediador irá analisar o caso e decidir sobre a liberação dos fundos.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {escrow.status === 'funded' && (
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => handleAction('release')} 
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                Liberar Fundos para Vendedor
              </button>
              <button 
                onClick={() => handleAction('refund')} 
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1"
                disabled={loading}
              >
                Reembolsar Comprador
              </button>
              <button 
                onClick={() => handleAction('dispute')} 
                className="btn bg-red-100 text-red-800 hover:bg-red-200 flex-1"
                disabled={loading}
              >
                Abrir Disputa
              </button>
            </div>
          )}
          
          {escrow.status !== 'funded' && (
            <button 
              onClick={() => {
                setEscrow(null);
                setEscrowId('');
              }} 
              className="btn btn-primary"
            >
              Voltar para Busca
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EscrowViewer;
