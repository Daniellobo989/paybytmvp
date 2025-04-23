import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Tipo para conversa
interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    email_hash: string;
  }>;
  product?: {
    id: string;
    title: string;
    image: string;
    price: {
      amount: number;
      currency: string;
    };
  };
  created_at: string;
  updated_at: string;
}

// Tipo para mensagem
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_encrypted: boolean;
  is_read: boolean;
  created_at: string;
}

const ConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('301'); // Simulando usuário atual

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Dados de exemplo para o MVP
  useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockConversation: Conversation = {
        id: id || '1',
        participants: [
          {
            id: '301', // usuário atual
            email_hash: 'b2c3d4e5f6g7h8i9j0k1'
          },
          {
            id: '201',
            email_hash: 'a1b2c3d4e5f6g7h8i9j0'
          }
        ],
        product: {
          id: '101',
          title: 'Smartphone Samsung Galaxy S21',
          image: 'https://via.placeholder.com/300x300.png?text=Samsung+Galaxy+S21',
          price: {
            amount: 15000000,
            currency: 'SATS'
          }
        },
        created_at: '2025-04-15T10:30:00Z',
        updated_at: '2025-04-16T14:15:00Z'
      };
      
      const mockMessages: Message[] = [
        {
          id: 'm1',
          conversation_id: id || '1',
          sender_id: '301', // usuário atual
          content: 'Olá, gostaria de confirmar se o produto está disponível para envio imediato.',
          is_encrypted: true,
          is_read: true,
          created_at: '2025-04-15T10:35:00Z'
        },
        {
          id: 'm2',
          conversation_id: id || '1',
          sender_id: '201',
          content: 'Olá! Sim, o produto está em estoque e será enviado assim que o pagamento for confirmado.',
          is_encrypted: true,
          is_read: true,
          created_at: '2025-04-15T10:40:00Z'
        },
        {
          id: 'm3',
          conversation_id: id || '1',
          sender_id: '301', // usuário atual
          content: 'Ótimo! Acabei de enviar o pagamento para o endereço de escrow.',
          is_encrypted: true,
          is_read: true,
          created_at: '2025-04-15T11:30:00Z'
        },
        {
          id: 'm4',
          conversation_id: id || '1',
          sender_id: '201',
          content: 'Pagamento recebido! Vou preparar o envio e te informar o código de rastreamento assim que disponível.',
          is_encrypted: true,
          is_read: true,
          created_at: '2025-04-15T11:50:00Z'
        },
        {
          id: 'm5',
          conversation_id: id || '1',
          sender_id: '201',
          content: 'Produto enviado! O código de rastreamento é TR123456789.',
          is_encrypted: true,
          is_read: true,
          created_at: '2025-04-16T14:15:00Z'
        }
      ];
      
      setConversation(mockConversation);
      setMessages(mockMessages);
      setIsLoading(false);
      
      // Simular rolagem para o final da conversa
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    }, 1000);
  }, [id]);

  // Enviar nova mensagem
  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;
    
    // Simulando envio de mensagem para o MVP
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content: newMessage,
      is_encrypted: true,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simular rolagem para o final da conversa
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  // Obter o outro participante da conversa
  const getOtherParticipant = () => {
    if (!conversation) return null;
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  // Formatar preço em Bitcoin/Sats
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else {
      return `${amount.toLocaleString()} sats`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Conversa não encontrada</h3>
        <p className="text-gray-600 mb-4">
          A conversa que você está procurando não existe ou foi removida.
        </p>
        <Link 
          to="/messages" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Voltar para Mensagens
        </Link>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

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
              <Link to="/messages" className="text-primary-500 hover:text-primary-700">Mensagens</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">Conversa com {otherParticipant ? otherParticipant.email_hash.substring(0, 8) + '...' : 'Usuário desconhecido'}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Coluna 1: Mensagens */}
        <div className="md:col-span-2 border-r border-gray-200">
          {/* Cabeçalho da conversa */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {otherParticipant ? otherParticipant.email_hash.substring(0, 8) + '...' : 'Usuário desconhecido'}
                </h2>
                {conversation.product && (
                  <p className="text-sm text-gray-600">
                    Produto: {conversation.product.title}
                  </p>
                )}
              </div>
              {conversation.product && (
                <Link 
                  to={`/product/${conversation.product.id}`}
                  className="text-primary-500 hover:text-primary-700 text-sm font-medium"
                >
                  Ver Produto
                </Link>
              )}
            </div>
          </div>
          
          {/* Mensagens */}
          <div 
            id="messages-container"
            className="p-4 h-[calc(100vh-300px)] overflow-y-auto space-y-4"
          >
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      isCurrentUser 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-xs mb-1 flex items-center">
                      <span>
                        {isCurrentUser ? 'Você' : 'Vendedor'} • {formatDate(message.created_at)}
                      </span>
                      {message.is_encrypted && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Input de mensagem */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Todas as mensagens são criptografadas de ponta a ponta</span>
            </div>
          </div>
        </div>
        
        {/* Coluna 2: Informações do Produto */}
        <div className="p-4">
          {conversation.product ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Produto</h3>
              <div className="mb-4">
                <img 
                  src={conversation.product.image} 
                  alt={conversation.product.title} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <h4 className="text-md font-medium text-gray-800 mb-2">{conversation.product.title}</h4>
              {conversation.product.price && (
                <div className="mb-4">
                  <span className="text-lg font-semibold text-primary-500">
                    {formatPrice(conversation.product.price.amount, conversation.product.price.currency)}
                  </span>
                </div>
              )}
              <div className="space-y-3">
                <Link
                  to={`/product/${conversation.product.id}`}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md text-center font-medium transition-colors"
                >
                  Ver Detalhes do Produto
                </Link>
                <Link
                  to={`/checkout/${conversation.product.id}`}
                  className="block w-full bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-md text-center font-medium transition-colors"
                >
                  Comprar Agora
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p className="text-sm text-gray-600">
                Esta conversa não está associada a nenhum produto específico.
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
            <div className="space-y-3">
              <Link
                to="/messages"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md text-center font-medium transition-colors"
              >
                Voltar para Mensagens
              </Link>
              {conversation.product && (
                <Link
                  to={`/transaction/create/${conversation.product.id}`}
                  className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-center font-medium transition-colors"
                >
                  Iniciar Transação
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
