import React, { useState } from 'react';
import LightningPaymentComponent from './LightningPaymentComponent';
import DeliveryVerificationComponent from './DeliveryVerificationComponent';
import FeeSummaryComponent from './FeeSummaryComponent';

interface LightningCheckoutProps {
  amount: string;
  description: string;
  orderId?: string;
  trackingCode?: string;
  carrier?: string;
  isDigitalProduct?: boolean;
  onPaymentComplete: () => void;
  onDeliveryConfirmed: () => void;
}

const LightningCheckoutPage: React.FC<LightningCheckoutProps> = ({
  amount,
  description,
  orderId,
  trackingCode,
  carrier,
  isDigitalProduct = false,
  onPaymentComplete,
  onDeliveryConfirmed
}) => {
  const [currentStep, setCurrentStep] = useState<'payment' | 'delivery' | 'complete'>('payment');
  const [error, setError] = useState<string | null>(null);
  
  const handlePaymentSuccess = () => {
    setCurrentStep('delivery');
    onPaymentComplete();
  };
  
  const handlePaymentError = (error: Error) => {
    console.error('Erro no pagamento:', error);
    setError(`Erro no pagamento: ${error.message}`);
  };
  
  const handleDeliveryConfirmed = () => {
    setCurrentStep('complete');
    onDeliveryConfirmed();
  };
  
  return (
    <div className="lightning-checkout-container max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Checkout com Lightning Network</h2>
        <p className="text-center text-gray-600">Pagamento rápido e com baixas taxas usando Bitcoin Lightning Network</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <div className="steps-container mb-6">
        <div className="flex items-center justify-between">
          <div className={`step flex flex-col items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'payment' ? 'bg-blue-100 border-2 border-blue-600' : 
              currentStep === 'delivery' || currentStep === 'complete' ? 'bg-green-100 border-2 border-green-600' : 
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              <span className="text-lg font-bold">1</span>
            </div>
            <span className="mt-1 text-sm">Pagamento</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            {(currentStep === 'delivery' || currentStep === 'complete') && (
              <div className="h-full bg-green-500"></div>
            )}
          </div>
          
          <div className={`step flex flex-col items-center ${
            currentStep === 'delivery' ? 'text-blue-600' : 
            currentStep === 'complete' ? 'text-green-600' : 
            'text-gray-500'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'delivery' ? 'bg-blue-100 border-2 border-blue-600' : 
              currentStep === 'complete' ? 'bg-green-100 border-2 border-green-600' : 
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              <span className="text-lg font-bold">2</span>
            </div>
            <span className="mt-1 text-sm">Entrega</span>
          </div>
          
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            {currentStep === 'complete' && (
              <div className="h-full bg-green-500"></div>
            )}
          </div>
          
          <div className={`step flex flex-col items-center ${
            currentStep === 'complete' ? 'text-green-600' : 'text-gray-500'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'complete' ? 'bg-green-100 border-2 border-green-600' : 
              'bg-gray-100 border-2 border-gray-300'
            }`}>
              <span className="text-lg font-bold">3</span>
            </div>
            <span className="mt-1 text-sm">Concluído</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <FeeSummaryComponent amount={amount} transactionType="lightning" />
      </div>
      
      {currentStep === 'payment' && (
        <div className="payment-step">
          <LightningPaymentComponent 
            amount={amount}
            description={description}
            orderId={orderId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      )}
      
      {currentStep === 'delivery' && !isDigitalProduct && trackingCode && carrier && (
        <div className="delivery-step">
          <DeliveryVerificationComponent 
            trackingCode={trackingCode}
            carrier={carrier}
            onDeliveryConfirmed={handleDeliveryConfirmed}
          />
        </div>
      )}
      
      {currentStep === 'delivery' && isDigitalProduct && (
        <div className="digital-delivery-step bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Entrega de Produto Digital</h3>
          
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="text-gray-700">Seu produto digital está pronto para download:</p>
            
            {/* Simulação de entrega digital */}
            <div className="mt-4 p-4 border border-gray-200 rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium">{description}</span>
                <a 
                  href="#download"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeliveryConfirmed();
                  }}
                >
                  Download
                </a>
              </div>
              
              {orderId && (
                <p className="text-sm text-gray-500 mt-1">ID do Pedido: {orderId}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeliveryConfirmed}
            >
              Confirmar Recebimento
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 'complete' && (
        <div className="complete-step bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-gray-800">Transação Concluída!</h3>
          
          <p className="text-gray-600 mb-4">
            Seu pagamento foi confirmado e a entrega foi verificada com sucesso.
            Os fundos foram liberados automaticamente para o vendedor.
          </p>
          
          <div className="bg-gray-50 p-4 rounded mb-4 text-left">
            <p className="text-sm text-gray-600">Valor: <span className="font-semibold">{amount} BTC</span></p>
            {orderId && (
              <p className="text-sm text-gray-600">ID do Pedido: <span className="font-semibold">{orderId}</span></p>
            )}
            {trackingCode && !isDigitalProduct && (
              <p className="text-sm text-gray-600">Código de Rastreio: <span className="font-semibold">{trackingCode}</span></p>
            )}
          </div>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.href = '/'}
          >
            Voltar para a Página Inicial
          </button>
        </div>
      )}
    </div>
  );
};

export default LightningCheckoutPage;
