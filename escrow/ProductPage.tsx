import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Tipo para os produtos
interface Product {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  seller: {
    id: string;
    email_hash: string;
    reputation: {
      rating: number;
      total_transactions: number;
    };
  };
  images: Array<{
    url: string;
    hash: string;
  }>;
  category: string;
  tags: string[];
  shipping_options: Array<{
    method: string;
    price: number;
    estimated_days: number;
  }>;
  status: string;
  created_at: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedShipping, setSelectedShipping] = useState<number>(0);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Função para formatar preço em Bitcoin/Sats
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else {
      return `${amount.toLocaleString()} sats`;
    }
  };

  // Dados de exemplo para o MVP
  React.useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockProduct: Product = {
        id: id || '1',
        title: 'Smartphone Samsung Galaxy S21',
        description: 'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, 8GB de RAM, tela AMOLED de 6.2 polegadas. Câmera tripla de 64MP, bateria de 4000mAh, resistente à água e poeira (IP68). Produto novo, na caixa, com garantia de 1 ano do fabricante.\n\nEspecificações:\n- Processador: Exynos 2100\n- Memória RAM: 8GB\n- Armazenamento: 128GB\n- Tela: 6.2" Dynamic AMOLED 2X, 120Hz\n- Câmeras traseiras: 12MP (wide) + 64MP (telephoto) + 12MP (ultrawide)\n- Câmera frontal: 10MP\n- Bateria: 4000mAh\n- Sistema: Android 11\n- Cor: Phantom Black',
        price: {
          amount: 15000000,
          currency: 'SATS'
        },
        seller: {
          id: '101',
          email_hash: 'a1b2c3d4e5f6g7h8i9j0',
          reputation: {
            rating: 4.8,
            total_transactions: 56
          }
        },
        images: [
          {
            url: 'https://via.placeholder.com/600x600.png?text=Samsung+Galaxy+S21+1',
            hash: 'hash1'
          },
          {
            url: 'https://via.placeholder.com/600x600.png?text=Samsung+Galaxy+S21+2',
            hash: 'hash2'
          },
          {
            url: 'https://via.placeholder.com/600x600.png?text=Samsung+Galaxy+S21+3',
            hash: 'hash3'
          }
        ],
        category: 'Eletrônicos',
        tags: ['smartphone', 'samsung', 'android', 'galaxy'],
        shipping_options: [
          {
            method: 'Padrão',
            price: 500000,
            estimated_days: 7
          },
          {
            method: 'Expresso',
            price: 1000000,
            estimated_days: 3
          }
        ],
        status: 'active',
        created_at: '2025-04-15T10:30:00Z'
      };
      
      setProduct(mockProduct);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Iniciar compra
  const handleBuy = () => {
    // Aqui seria a lógica para iniciar o processo de compra
    // Para o MVP, apenas exibimos um alerta
    alert('Funcionalidade de compra será implementada em breve!');
  };

  // Enviar mensagem ao vendedor
  const handleSendMessage = () => {
    // Aqui seria a lógica para enviar mensagem
    // Para o MVP, apenas exibimos um alerta
    alert(`Mensagem enviada: ${message}`);
    setMessage('');
    setShowContactModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Produto não encontrado</h3>
        <p className="text-gray-600 mb-4">
          O produto que você está procurando não existe ou foi removido.
        </p>
        <Link 
          to="/" 
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Voltar para a Página Inicial
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
              <Link to={`/category/${product.category}`} className="text-primary-500 hover:text-primary-700">{product.category}</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">{product.title}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.images[selectedImage].url} 
                alt={product.title} 
                className="w-full h-96 object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.title} - imagem ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Informações do Produto */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
            
            {/* Preço */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary-500">
                {formatPrice(product.price.amount, product.price.currency)}
              </span>
            </div>
            
            {/* Informações do Vendedor */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Vendedor:</span>
                  <div className="flex items-center">
                    <span className="font-medium text-primary-500">
                      {product.seller.email_hash.substring(0, 8)}...
                    </span>
                    <div className="ml-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600 ml-1">{product.seller.reputation.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.seller.reputation.total_transactions} transações concluídas
                  </div>
                </div>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-primary-500 hover:text-primary-700 text-sm font-medium"
                >
                  Contatar Vendedor
                </button>
              </div>
            </div>
            
            {/* Opções de Envio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Opções de Envio</h3>
              <div className="space-y-2">
                {product.shipping_options.map((option, index) => (
                  <div 
                    key={index}
                    className={`border rounded-md p-3 cursor-pointer ${selectedShipping === index ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedShipping(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.method}</div>
                        <div className="text-sm text-gray-500">
                          Entrega em {option.estimated_days} dias
                        </div>
                      </div>
                      <div className="font-medium text-primary-500">
                        {formatPrice(option.price, 'SATS')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleBuy}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-md font-medium transition-colors"
              >
                Comprar Agora
              </button>
              <Link
                to="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-medium text-center transition-colors"
              >
                Voltar para Produtos
              </Link>
            </div>
            
            {/* Tags */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/search?query=${tag}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Descrição do Produto */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Descrição do Produto</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
        
        {/* Informações de Segurança */}
        <div className="mt-10 bg-primary-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-primary-700 mb-2">Compre com Segurança</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-700">Escrow Multisig</h3>
                <p className="text-xs text-gray-600">
                  Seu pagamento fica protegido até que você confirme o recebimento do produto.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-1-1H6v-1h2l2.257-2.243A6 6 0 1118 8zm-6-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-700">Resolução de Disputas</h3>
                <p className="text-xs text-gray-600">
                  Sistema de mediação caso ocorra qualquer problema com a transação.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-700">Privacidade Garantida</h3>
                <p className="text-xs text-gray-600">
                  Suas informações pessoais são protegidas durante todo o processo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Contato */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <
(Content truncated due to size limit. Use line ranges to read in chunks)