import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Tipo para produto
interface Product {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  seller: {
    id: string;
    email_hash: string;
    reputation: {
      rating: number;
      total_transactions: number;
    };
  };
  shipping_options: Array<{
    id: string;
    name: string;
    price: number;
    estimated_days: string;
  }>;
  created_at: string;
}

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [escrowAddress, setEscrowAddress] = useState<string>('');
  const [isCreatingTransaction, setIsCreatingTransaction] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  // Função para formatar preço em Bitcoin/Sats
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else {
      return `${amount.toLocaleString()} sats`;
    }
  };

  // Dados de exemplo para o MVP
  useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockProduct: Product = {
        id: id || '101',
        title: 'Smartphone Samsung Galaxy S21',
        description: 'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, 8GB de RAM, tela AMOLED de 6.2 polegadas.',
        price: {
          amount: 15000000,
          currency: 'SATS'
        },
        images: [
          'https://via.placeholder.com/500x500.png?text=Samsung+Galaxy+S21+1',
          'https://via.placeholder.com/500x500.png?text=Samsung+Galaxy+S21+2',
          'https://via.placeholder.com/500x500.png?text=Samsung+Galaxy+S21+3'
        ],
        seller: {
          id: '201',
          email_hash: 'a1b2c3d4e5f6g7h8i9j0',
          reputation: {
            rating: 4.8,
            total_transactions: 56
          }
        },
        shipping_options: [
          {
            id: 'shipping_1',
            name: 'Padrão',
            price: 500000,
            estimated_days: '5-7 dias'
          },
          {
            id: 'shipping_2',
            name: 'Expresso',
            price: 1000000,
            estimated_days: '2-3 dias'
          }
        ],
        created_at: '2025-04-10T09:15:00Z'
      };
      
      setProduct(mockProduct);
      setSelectedShipping(mockProduct.shipping_options[0].id);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Calcular total
  const calculateTotal = () => {
    if (!product) return 0;
    
    const shippingOption = product.shipping_options.find(option => option.id === selectedShipping);
    const shippingPrice = shippingOption ? shippingOption.price : 0;
    
    return product.price.amount + shippingPrice;
  };

  // Gerar endereço de escrow
  const generateEscrowAddress = async () => {
    setIsCreatingTransaction(true);
    setError('');
    
    try {
      // Simulando chamada para API de escrow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Endereço de escrow multisig simulado
      const mockEscrowAddress = 'bc1qxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz';
      setEscrowAddress(mockEscrowAddress);
      setStep(2);
    } catch (err) {
      setError('Erro ao gerar endereço de escrow. Tente novamente.');
    } finally {
      setIsCreatingTransaction(false);
    }
  };

  // Verificar pagamento
  const checkPayment = async () => {
    setIsCreatingTransaction(true);
    setError('');
    
    try {
      // Simulando verificação de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulando sucesso
      navigate(`/transaction/1?status=success`);
    } catch (err) {
      setError('Erro ao verificar pagamento. Tente novamente mais tarde.');
      setIsCreatingTransaction(false);
    }
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
          Voltar para Início
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
              <Link to={`/product/${product.id}`} className="text-primary-500 hover:text-primary-700">Produto</Link>
              <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">Checkout</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Compra</h1>
        
        {/* Indicador de Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="text-xs mt-1">Informações</span>
            </div>
            <div className={`flex-grow h-1 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="text-xs mt-1">Pagamento</span>
            </div>
            <div className={`flex-grow h-1 mx-2 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="text-xs mt-1">Confirmação</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1: Formulário de Checkout */}
          <div className="md:col-span-2">
            {step === 1 && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Envio</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço de Entrega
                    </label>
                    <textarea
                      id="shipping_address"
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="shipping_option" className="block text-sm font-medium text-gray-700 mb-1">
                      Opção de Envio
                    </label>
                    <div className="space-y-2">
                      {product.shipping_options.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            id={option.id}
                            type="radio"
                            name="shipping_option"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300"
                          />
                          <label htmlFor={option.id} className="ml-2 block text-sm text-gray-700">
                            <span className="font-medium">{option.name}</span> - {formatPrice(option.price, 'SATS')} - {option.estimated_days}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações de Pagamento</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="bitcoin_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Seu Endereço Bitcoin (para reembolso, se necessário)
                    </label>
                    <input
                      id="bitcoin_address"
                      type="text"
                      value={bitcoinAddress}
                      onChange={(e) => setBitcoinAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="bc1q..."
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Voltar para Produto
                  </Link>
                  <button
                    onClick={generateEscrowAddress}
                    disabled={isCreatingTransaction || !shippingAddress || !bitcoinAddress}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreatingTransaction ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      'Continuar para Pagamento'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagamento via Bitcoin</h2>
                  
                  <div className="mb-6 text-center">
                    <div className="bg-white p-4 rounded-md inline-block mb-4">
                      {/* Aqui seria um QR code real */}
                      <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center">
                        <span className="text-gray-500 text-xs">QR Code do Endereço Bitcoin</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Envie exatamente:</p>
                      <p className="text-xl font-bold text-primary-500">{formatPrice(calculateTotal(), 'SATS')}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Para o endereço de escrow multisig:</p>
                      <div className="flex items-center justify-center">
                        <code className="text-sm bg-gray-100 p-2 rounded font-mono break-all">
                          {escrowAddress}
                        </code>
                        <button 
                          onClick={() => navigator.clipboard.writeText(escrowAddress)}
                          className="ml-2 text-primary-500 hover:text-primary-700"
                          title="Copiar endereço"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button
(Content truncated due to size limit. Use line ranges to read in chunks)