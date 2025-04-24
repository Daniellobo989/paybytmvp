import React, { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode';
import { useWebLN } from '../../hooks/useWebLN';
import { lightningService } from '../../services/lightningService';

interface LightningPaymentProps {
  amount: string;
  orderId?: string;
  description: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

const LightningPaymentComponent: React.FC<LightningPaymentProps> = ({
  amount,
  orderId,
  description,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { supported: webLNSupported, pay: webLNPay } = useWebLN();
  
  useEffect(() => {
    const createInvoice = async () => {
      try {
        setLoading(true);
        const invoiceData = await lightningService.createInvoice(amount, description, orderId);
        setInvoice(invoiceData);
        
        // Iniciar polling para verificar status do pagamento
        const checkInterval = setInterval(async () => {
          const status = await lightningService.checkInvoiceStatus(invoiceData.invoiceId);
          setPaymentStatus(status);
          
          if (status === 'paid' || status === 'expired') {
            clearInterval(checkInterval);
            if (status === 'paid') onPaymentSuccess();
          }
        }, 3000);
        
        return () => clearInterval(checkInterval);
      } catch (error) {
        console.error('Erro ao criar fatura Lightning:', error);
        setError('Falha ao criar fatura de pagamento Lightning. Tente novamente.');
        onPaymentError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    createInvoice();
  }, [amount, orderId, description, onPaymentSuccess, onPaymentError]);
  
  const handleWebLNPay = async () => {
    if (!invoice) return;
    
    try {
      await webLNPay(invoice.paymentRequest);
      // O status será atualizado pelo polling
    } catch (error) {
      console.error('WebLN payment error:', error);
      setError('Erro ao processar pagamento via carteira Lightning. Tente escanear o QR code.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        <p className="ml-4 text-lg">Gerando fatura Lightning...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }
  
  if (!invoice) return null;
  
  return (
    <div className="lightning-payment-container bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Pagamento via Lightning Network</h3>
      
      <div className="invoice-details bg-gray-50 p-4 rounded mb-4">
        <p className="text-sm text-gray-600">Valor: <span className="font-semibold">{amount} BTC</span></p>
        <p className="text-sm text-gray-600">Taxa da plataforma: <span className="font-semibold">{invoice.platformFee} BTC</span></p>
        <p className="text-sm text-gray-600">Total: <span className="font-semibold">{(parseFloat(amount) + parseFloat(invoice.platformFee || '0')).toFixed(8)} BTC</span></p>
      </div>
      
      <div className="qr-container flex justify-center mb-4">
        {invoice.qrCodeUrl ? (
          <img src={invoice.qrCodeUrl} alt="QR Code para pagamento Lightning" className="w-64 h-64" />
        ) : (
          <QRCode value={invoice.paymentRequest} size={250} />
        )}
      </div>
      
      <div className="payment-options flex flex-col gap-4">
        {webLNSupported && (
          <button 
            className="webln-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            onClick={handleWebLNPay}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Pagar com Carteira Lightning
          </button>
        )}
        
        <div className="manual-instructions bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-2">Ou escaneie o código QR com sua carteira Lightning Network</p>
          <div className="payment-request flex">
            <input 
              type="text" 
              readOnly 
              value={invoice.paymentRequest} 
              onClick={(e) => e.currentTarget.select()}
              className="flex-grow p-2 text-xs border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => navigator.clipboard.writeText(invoice.paymentRequest)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
      
      <div className={`payment-status mt-4 p-3 rounded text-center ${
        paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
        paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800'
      }`}>
        Status: {
          paymentStatus === 'pending' ? 'Aguardando pagamento' : 
          paymentStatus === 'paid' ? 'Pagamento confirmado!' : 
          'Fatura expirada'
        }
      </div>
      
      {paymentStatus === 'expired' && (
        <button 
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Gerar Nova Fatura
        </button>
      )}
    </div>
  );
};

export default LightningPaymentComponent;
