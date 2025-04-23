import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Tipo para transações
interface Transaction {
  id: string;
  product: {
    id: string;
    title: string;
    image: string;
  };
  seller: {
    id: string;
    email_hash: string;
  };
  buyer: {
    id: string;
    email_hash: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  escrow: {
    status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
    multisig_address: string;
    created_at: string;
    updated_at: string;
  };
  shipping: {
    method: string;
    tracking_number?: string;
    status: 'pending' | 'shipped' | 'delivered';
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  updated_at: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'buying' | 'selling'>('all');
  const [filter, setFilter] = useState<string>('all');

  // Função para formatar preço em Bitcoin/Sats
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else {
      return `${amount.toLocaleString()} sats`;
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Função para obter classe de status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'funded':
        return 'bg-purple-100 text-purple-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Dados de exemplo para o MVP
  useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          product: {
            id: '101',
            title: 'Smartphone Samsung Galaxy S21',
            image: 'https://via.placeholder.com/100x100.png?text=Samsung+Galaxy+S21'
          },
          seller: {
            id: '201',
            email_hash: 'a1b2c3d4e5f6g7h8i9j0'
          },
          buyer: {
            id: '301',
            email_hash: 'b2c3d4e5f6g7h8i9j0k1'
          },
          price: {
            amount: 15000000,
            currency: 'SATS'
          },
          escrow: {
            status: 'funded',
            multisig_address: 'bc1q...xyz',
            created_at: '2025-04-15T10:30:00Z',
            updated_at: '2025-04-15T11:45:00Z'
          },
          shipping: {
            method: 'Padrão',
            tracking_number: 'TR123456789',
            status: 'shipped'
          },
          status: 'in_progress',
          created_at: '2025-04-15T10:30:00Z',
          updated_at: '2025-04-16T14:20:00Z'
        },
        {
          id: '2',
          product: {
            id: '102',
            title: 'Notebook Dell XPS 13',
            image: 'https://via.placeholder.com/100x100.png?text=Dell+XPS+13'
          },
          seller: {
            id: '202',
            email_hash: 'c3d4e5f6g7h8i9j0k1l2'
          },
          buyer: {
            id: '301',
            email_hash: 'b2c3d4e5f6g7h8i9j0k1'
          },
          price: {
            amount: 45000000,
            currency: 'SATS'
          },
          escrow: {
            status: 'pending',
            multisig_address: 'bc1q...abc',
            created_at: '2025-04-14T14:45:00Z',
            updated_at: '2025-04-14T14:45:00Z'
          },
          shipping: {
            method: 'Expresso',
            status: 'pending'
          },
          status: 'pending',
          created_at: '2025-04-14T14:45:00Z',
          updated_at: '2025-04-14T14:45:00Z'
        },
        {
          id: '3',
          product: {
            id: '103',
            title: 'Tênis Nike Air Max',
            image: 'https://via.placeholder.com/100x100.png?text=Nike+Air+Max'
          },
          seller: {
            id: '301',
            email_hash: 'b2c3d4e5f6g7h8i9j0k1'
          },
          buyer: {
            id: '203',
            email_hash: 'd4e5f6g7h8i9j0k1l2m3'
          },
          price: {
            amount: 5000000,
            currency: 'SATS'
          },
          escrow: {
            status: 'released',
            multisig_address: 'bc1q...def',
            created_at: '2025-04-10T09:15:00Z',
            updated_at: '2025-04-13T16:30:00Z'
          },
          shipping: {
            method: 'Padrão',
            tracking_number: 'TR987654321',
            status: 'delivered'
          },
          status: 'completed',
          created_at: '2025-04-10T09:15:00Z',
          updated_at: '2025-04-13T16:30:00Z'
        },
        {
          id: '4',
          product: {
            id: '104',
            title: 'Livro: Dominando Bitcoin',
            image: 'https://via.placeholder.com/100x100.png?text=Dominando+Bitcoin'
          },
          seller: {
            id: '204',
            email_hash: 'e5f6g7h8i9j0k1l2m3n4'
          },
          buyer: {
            id: '301',
            email_hash: 'b2c3d4e5f6g7h8i9j0k1'
          },
          price: {
            amount: 2000000,
            currency: 'SATS'
          },
          escrow: {
            status: 'disputed',
            multisig_address: 'bc1q...ghi',
            created_at: '2025-04-05T16:20:00Z',
            updated_at: '2025-04-08T11:10:00Z'
          },
          shipping: {
            method: 'Padrão',
            tracking_number: 'TR456789123',
            status: 'shipped'
          },
          status: 'disputed',
          created_at: '2025-04-05T16:20:00Z',
          updated_at: '2025-04-08T11:10:00Z'
        }
      ];
      
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrar transações com base na aba ativa e no filtro
  const filteredTransactions = transactions.filter(transaction => {
    // Filtrar por aba (compras/vendas)
    if (activeTab === 'buying' && transaction.buyer.email_hash !== 'b2c3d4e5f6g7h8i9j0k1') {
      return false;
    }
    if (activeTab === 'selling' && transaction.seller.email_hash !== 'b2c3d4e5f6g7h8i9j0k1') {
      return false;
    }
    
    // Filtrar por status
    if (filter !== 'all' && transaction.status !== filter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Transações</h1>
        
        {/* Abas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveTab('buying')}
              className={`pb-3 px-1 ${
                activeTab === 'buying'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compras
            </button>
            <button
              onClick={() => setActiveTab('selling')}
              className={`pb-3 px-1 ${
                activeTab === 'selling'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vendas
            </button>
          </nav>
        </div>
        
        {/* Filtros */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">
              Filtrar por:
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluídas</option>
              <option value="disputed">Em disputa</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          <Link
            to="/create-product"
            className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Vender Produto
          </Link>
        </div>
        
        {/* Lista de Transações */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'selling' ? 'Comprador' : activeTab === 'buying' ? 'Vendedor' : 'Participantes'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md" src={transaction.product.image} alt={transaction.product.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {transaction.product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {transaction.product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'selling' ? (
                        <div className="text-sm text-gray-900">
                          {transaction.buyer.email_hash.substring(0, 8)}...
                        </div>
                      ) : activeTab === 'buying' ? (
                        <div className="text-sm text-gray-900">
                          {transaction.seller.email_hash.substring(0, 8)}...
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">
                            V: {transaction.seller.email_hash.substring(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            C: {transaction.buyer.email_hash.substring(0, 8)}...
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-500">
                        {formatPrice(transaction.price.amount, transaction.price.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                        {transaction.status === 'pending' && 'Pendente'}
                        {transaction.status === 'in_progress' && 'Em andamento'}
                        {transaction.status === 'completed' && 'Concluída'}
                        {transaction.status === 'disputed' && 'Em disputa'}
                        {transaction.status === 'cancelled' && 'Cancelada'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Escrow: <span className={`px-1 py-0.5 rounded ${getStatusClass(transaction.escrow.status)}`}>
                          {transaction.escrow.status === 'pending' && 'Pendente'}
                          {transaction.escrow.status === 'funded' && 'Financiado'}
                          {transaction.escrow.status === 'released' && 'Liberado'}
                          {transaction.escrow.status === 'refunded' && 'Reembolsado'}
                          {transaction.escrow.status === 'disputed' && 'Em disputa'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/transaction/${transaction.id}`} className="text-primary-500 hover:text-primary-700">
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-1
(Content truncated due to size limit. Use line ranges to read in chunks)