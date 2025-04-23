import React, { useState, useEffect } from 'react';

interface EscrowHistoryItem {
  escrowId: string;
  amount: string;
  description: string;
  status: 'funded' | 'in_progress' | 'completed' | 'refunded' | 'disputed';
  createdAt: string;
  role: 'buyer' | 'seller';
}

const EscrowHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [escrows, setEscrows] = useState<EscrowHistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Simulação de busca de histórico de escrows
  useEffect(() => {
    // Simulação de chamada de API
    setTimeout(() => {
      // Mock de dados de histórico
      const mockEscrows: EscrowHistoryItem[] = [
        {
          escrowId: 'ESC7A3B9D2',
          amount: '0.05',
          description: 'Compra de laptop MacBook Pro 2025',
          status: 'completed',
          createdAt: '2025-04-15T10:30:00Z',
          role: 'buyer'
        },
        {
          escrowId: 'ESC5F2E8C1',
          amount: '0.02',
          description: 'Serviço de design gráfico',
          status: 'funded',
          createdAt: '2025-04-20T14:45:00Z',
          role: 'seller'
        },
        {
          escrowId: 'ESC9D7B3A5',
          amount: '0.01',
          description: 'Consultoria em Bitcoin',
          status: 'refunded',
          createdAt: '2025-04-10T09:15:00Z',
          role: 'buyer'
        },
        {
          escrowId: 'ESC2C4F6E8',
          amount: '0.03',
          description: 'Curso de programação blockchain',
          status: 'disputed',
          createdAt: '2025-04-05T16:20:00Z',
          role: 'seller'
        }
      ];
      
      setEscrows(mockEscrows);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEscrows = escrows.filter(escrow => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['funded', 'in_progress', 'disputed'].includes(escrow.status);
    if (filter === 'completed') return ['completed', 'refunded'].includes(escrow.status);
    return true;
  });

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
      <span className={`${color} px-2 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { color: string, text: string }> = {
      buyer: { color: 'bg-primary-light text-white', text: 'Comprador' },
      seller: { color: 'bg-bitcoin-light text-white', text: 'Vendedor' }
    };
    
    const { color, text } = roleMap[role] || { color: 'bg-gray-100 text-gray-800', text: 'Desconhecido' };
    
    return (
      <span className={`${color} px-2 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Histórico de Escrows</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${
              filter === 'active' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Concluídos
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500">Carregando histórico de escrows...</p>
        </div>
      ) : filteredEscrows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum escrow encontrado</h3>
          <p className="text-gray-500">
            Não há escrows que correspondam aos critérios de filtro selecionados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEscrows.map((escrow) => (
                <tr key={escrow.escrowId} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-primary">
                    {escrow.escrowId}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(escrow.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 max-w-xs truncate">
                    {escrow.description}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    ₿ {escrow.amount}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    {getRoleBadge(escrow.role)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    {getStatusBadge(escrow.status)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    <a 
                      href={`/escrow/${escrow.escrowId}`} 
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Ver Detalhes
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EscrowHistory;
