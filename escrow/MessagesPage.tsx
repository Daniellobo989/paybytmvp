import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Tipo para mensagens
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Tipo para conversas
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
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  created_at: string;
  updated_at: string;
}

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('301'); // Simulando usuário atual

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Se for hoje, mostrar apenas a hora
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Se for esta semana, mostrar o dia da semana
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Caso contrário, mostrar a data completa
    return date.toLocaleDateString();
  };

  // Dados de exemplo para o MVP
  useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: '1',
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
            image: 'https://via.placeholder.com/100x100.png?text=Samsung+Galaxy+S21'
          },
          last_message: {
            content: 'Produto enviado! O código de rastreamento é TR123456789.',
            created_at: '2025-04-16T14:15:00Z',
            sender_id: '201'
          },
          created_at: '2025-04-15T10:30:00Z',
          updated_at: '2025-04-16T14:15:00Z'
        },
        {
          id: '2',
          participants: [
            {
              id: '301', // usuário atual
              email_hash: 'b2c3d4e5f6g7h8i9j0k1'
            },
            {
              id: '202',
              email_hash: 'c3d4e5f6g7h8i9j0k1l2'
            }
          ],
          product: {
            id: '102',
            title: 'Notebook Dell XPS 13',
            image: 'https://via.placeholder.com/100x100.png?text=Dell+XPS+13'
          },
          last_message: {
            content: 'Olá! Sim, o produto está em estoque e será enviado assim que o pagamento for confirmado.',
            created_at: '2025-04-14T10:40:00Z',
            sender_id: '202'
          },
          created_at: '2025-04-14T10:30:00Z',
          updated_at: '2025-04-14T10:40:00Z'
        },
        {
          id: '3',
          participants: [
            {
              id: '301', // usuário atual
              email_hash: 'b2c3d4e5f6g7h8i9j0k1'
            },
            {
              id: '203',
              email_hash: 'd4e5f6g7h8i9j0k1l2m3'
            }
          ],
          product: {
            id: '103',
            title: 'Tênis Nike Air Max',
            image: 'https://via.placeholder.com/100x100.png?text=Nike+Air+Max'
          },
          last_message: {
            content: 'Obrigado pela compra! Espero que esteja satisfeito com o produto.',
            created_at: '2025-04-13T16:30:00Z',
            sender_id: '301'
          },
          created_at: '2025-04-10T09:15:00Z',
          updated_at: '2025-04-13T16:30:00Z'
        }
      ];
      
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Obter o outro participante da conversa
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mensagens</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isLastMessageFromOther = conversation.last_message?.sender_id !== currentUserId;
              
              return (
                <Link 
                  key={conversation.id}
                  to={`/conversation/${conversation.id}`}
                  className="block border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4 flex items-start">
                    {conversation.product && (
                      <div className="flex-shrink-0 mr-4">
                        <img 
                          src={conversation.product.image} 
                          alt={conversation.product.title} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-md font-semibold text-gray-800 truncate">
                          {otherParticipant ? otherParticipant.email_hash.substring(0, 8) + '...' : 'Usuário desconhecido'}
                        </h3>
                        {conversation.last_message && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(conversation.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      {conversation.product && (
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          Produto: {conversation.product.title}
                        </p>
                      )}
                      {conversation.last_message && (
                        <p className={`text-sm ${isLastMessageFromOther ? 'text-gray-800 font-medium' : 'text-gray-600'} truncate`}>
                          {isLastMessageFromOther ? '' : 'Você: '}
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma mensagem</h3>
            <p className="text-gray-600 mb-4">
              Você ainda não tem nenhuma conversa.
            </p>
            <Link 
              to="/" 
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
            >
              Explorar Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
