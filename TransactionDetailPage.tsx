import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Tipo para transação
interface Transaction {
  id: string;
  product: {
    id: string;
    title: string;
    image: string;
    description: string;
  };
  seller: {
    id: string;
    email_hash: string;
    reputation: {
      rating: number;
      total_transactions: number;
    };
  };
  buyer: {
    id: string;
    email_hash: string;
    reputation: {
      rating: number;
      total_transactions: number;
    };
  };
  price: {
    amount: number;
    currency: string;
  };
  escrow: {
    status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
    multisig_address: string;
    txid?: string;
    created_at: string;
    updated_at: string;
  };
  shipping: {
    method: string;
    tracking_number?: string;
    status: 'pending' | 'shipped' | 'delivered';
    address?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  messages: Array<{
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isUserBuyer, setIsUserBuyer] = useState<boolean>(false);
  const [isUserSeller, setIsUserSeller] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<string>('');

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
      // Usuário atual (simplificado para o MVP)
      const currentUserId = '301'; // Simulando que o usuário atual é o comprador
      
      const mockTransaction: Transaction = {
        id: id || '1',
        product: {
          id: '101',
          title: 'Smartphone Samsung Galaxy S21',
          image: 'https://via.placeholder.com/300x300.png?text=Samsung+Galaxy+S21',
          description: 'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, 8GB de RAM, tela AMOLED de 6.2 polegadas.'
        },
        seller: {
          id: '201',
          email_hash: 'a1b2c3d4e5f6g7h8i9j0',
          reputation: {
            rating: 4.8,
            total_transactions: 56
          }
        },
        buyer: {
          id: '301',
          email_hash: 'b2c3d4e5f6g7h8i9j0k1',
          reputation: {
            rating: 4.9,
            total_transactions: 23
          }
        },
        price: {
          amount: 15000000,
          currency: 'SATS'
        },
        escrow: {
          status: 'funded',
          multisig_address: 'bc1qxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz',
          txid: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          created_at: '2025-04-15T10:30:00Z',
          updated_at: '2025-04-15T11:45:00Z'
        },
        shipping: {
          method: 'Padrão',
          tracking_number: 'TR123456789',
          status: 'shipped',
          address: 'Rua Exemplo, 123 - Bairro - Cidade - Estado - CEP: 12345-678'
        },
        status: 'in_progress',
        messages: [
          {
            id: 'm1',
            sender_id: '301',
            content: 'Olá, gostaria de confirmar se o produto está disponível para envio imediato.',
            created_at: '2025-04-15T10:35:00Z'
          },
          {
            id: 'm2',
            sender_id: '201',
            content: 'Olá! Sim, o produto está em estoque e será enviado assim que o pagamento for confirmado.',
            created_at: '2025-04-15T10:40:00Z'
          },
          {
            id: 'm3',
            sender_id: '301',
            content: 'Ótimo! Acabei de enviar o pagamento para o endereço de escrow.',
            created_at: '2025-04-15T11:30:00Z'
          },
          {
            id: 'm4',
            sender_id: '201',
            content: 'Pagamento recebido! Vou preparar o envio e te informar o código de rastreamento assim que disponível.',
            created_at: '2025-04-15T11:50:00Z'
          },
          {
            id: 'm5',
            sender_id: '201',
            content: 'Produto enviado! O código de rastreamento é TR123456789.',
            created_at: '2025-04-16T14:15:00Z'
          }
        ],
        created_at: '2025-04-15T10:30:00Z',
        updated_at: '2025-04-16T14:20:00Z'
      };
      
      setTransaction(mockTransaction);
      setIsUserBuyer(mockTransaction.buyer.id === currentUserId);
      setIsUserSeller(mockTransaction.seller.id === currentUserId);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Enviar mensagem
  const handleSendMessage = () => {
    if (!message.trim() || !transaction) return;
    
    // Simulando envio de mensagem para o MVP
    const newMessage = {
      id: `m${transaction.messages.length + 1}`,
      sender_id: isUserBuyer ? transaction.buyer.id : transaction.seller.id,
      content: message,
      created_at: new Date().toISOString()
    };
    
    setTransaction({
      ...transaction,
      messages: [...transaction.messages, newMessage],
      updated_at: new Date().toISOString()
    });
    
    setMessage('');
  };

  // Confirmar recebimento (comprador)
  const handleConfirmReceipt = () => {
    if (!transaction) return;
    
    // Simulando confirmação de recebimento para o MVP
    setTransaction({
      ...transaction,
      status: 'completed',
      escrow: {
        ...transaction.escrow,
        status: 'released',
        updated_at: new Date().toISOString()
      },
      shipping: {
        ...transaction.shipping,
        status: 'delivered'
      },
      updated_at: new Date().toISOString()
    });
    
    setShowConfirmModal(false);
  };

  // Abrir disputa
  const handleOpenDispute = () => {
    if (!transaction) return;
    
    // Simulando abertura de disputa para o MVP
    setTransaction({
      ...transaction,
      status: 'disputed',
      escrow: {
        ...transaction.escrow,
        status: 'disputed',
        updated_at: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    });
    
    setShowConfirmModal(false);
  };

  // Atualizar código de rastreamento (vendedor)
  const handleUpdateTracking = () => {
    if (!transaction) return;
    
    // Simulando atualização de código de rastreamento para o MVP
    const trackingNumber = prompt('Digite o código de rastreamento:');
    if (!trackingNumber) return;
    
    setTransaction({
      ...transaction,
      shipping: {
        ...transaction.shipping,
        tracking_number: trackingNumber,
        status: 'shipped'
      },
      updated_at: new Date().toISOString()
    });
  };

  // Mostrar modal de confirmação
  const showConfirmationModal = (action: string) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Transação não encontrada</h3>
        <p className="text-gray-600 mb-4">
          A transação que você está procurando não existe ou foi removida.
        </p>
        <Link 
          to="/transactions" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Voltar para Transações
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-gray-50 px-6 py-3">
        <nav className="text-sm">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="text-primary-500 hover:text-primary-700">Início</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link to="/transactions" className="text-primary-500 hover:text-primary-700">Transações</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">Transação #{transaction.id}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Detalhes da Transação
          </h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(transaction.status)}`}>
            {transaction.status === 'pending' && 'Pendente'}
            {transaction.status === 'in_progress' && 'Em andamento'}
            {transaction.status === 'completed' && 'Concluída'}
            {transaction.status === 'disputed' && 'Em disputa'}
            {transaction.status === 'cancelled' && 'Cancelada'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1: Informações do Produto */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Produto</h2>
              <div className="flex">
                <div className="flex-shrink-0">
                  <img 
                    src={transaction.product.image} 
                    alt={transaction.product.title} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-800">{transaction.product.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{transaction.product.description}</p>
                  <div className="mt-2">
                    <span className="text-lg font-semibold text-primary-500">
                      {formatPrice(transaction.price.amount, transaction.price.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Informações de Envio */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Envio</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Método:</span>
                  <span className="text-sm text-gray-800">{transaction.shipping.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${getStatusClass(transaction.shipping.status)}`}>
                    {transaction.shipping.status === 'pending' && 'Pendente'}
                    {transaction.shipping.status === 'shipped' && 'Enviado'}
                    {transaction.shipping.status === 'delivered' && 'Entregue'}
                  </span>
                </div>
                {transaction.shipping.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Código de Rastreamento:</span>
                    <span className="text-sm text-primary-500 font-medium">{transaction.shipping.tracking_number}</span>
                  </div>
                )}
                {transaction.shipping.address && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600 block mb-1">Endereço de Entrega:</span>
                    <span className="text-sm text-gray-800 block">{transaction.shipping.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Informações de Escrow */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Escrow</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm px-2 py-0.5 rounded ${getStatusClass(transaction.escrow.status)}`}>
                    {transaction.escrow.status === 'pending' && 'Pendente'}
                    {transaction.escrow.status === 'funded' && 'Financiado'}
                    {transaction.escrow.status === 'released' && 'Liberado'}
                    {transaction.escrow.status === 'refunded' && 'Reembolsado'}
                    {transaction.escrow.status === 'disputed' && 'Em disputa'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Endereço Multisig:</span>
                  <span className="text-sm text-gray-800 font-mono">{transaction.escrow.multisig_address}</span>
      
(Content truncated due to size limit. Use line ranges to read in chunks)