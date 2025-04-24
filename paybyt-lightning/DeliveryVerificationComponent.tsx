import React, { useState, useEffect } from 'react';
import { oracleService } from '../../services/oracleService';

interface DeliveryVerificationProps {
  trackingCode: string;
  carrier: string;
  onDeliveryConfirmed: () => void;
}

const DeliveryVerificationComponent: React.FC<DeliveryVerificationProps> = ({
  trackingCode,
  carrier,
  onDeliveryConfirmed
}) => {
  const [deliveryStatus, setDeliveryStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const registerTracking = async () => {
      try {
        setLoading(true);
        
        // Verificar se o código já está registrado
        let status = oracleService.getDeliveryStatus(trackingCode);
        
        // Se não estiver registrado, registrar
        if (!status) {
          status = oracleService.registerTrackingCode(trackingCode, carrier);
        }
        
        setDeliveryStatus(status);
        
        // Gerar QR code para confirmação de entrega
        const qrCode = await oracleService.generateDeliveryQRCode(trackingCode);
        setQrCodeUrl(qrCode);
        
        // Iniciar polling para verificar status de entrega
        const checkInterval = setInterval(async () => {
          try {
            const updatedStatus = await oracleService.checkTrackingStatus(trackingCode);
            setDeliveryStatus(updatedStatus);
            
            if (updatedStatus.status === 'delivered') {
              clearInterval(checkInterval);
              onDeliveryConfirmed();
            }
          } catch (error) {
            console.error('Erro ao verificar status de entrega:', error);
          }
        }, 60000); // Verificar a cada minuto
        
        return () => clearInterval(checkInterval);
      } catch (error) {
        console.error('Erro ao registrar código de rastreio:', error);
        setError('Falha ao registrar código de rastreio. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    registerTracking();
  }, [trackingCode, carrier, onDeliveryConfirmed]);
  
  const handleManualConfirmation = async () => {
    try {
      setLoading(true);
      
      // Simular confirmação manual (em produção, isso seria feito via QR code)
      const confirmationCode = Math.random().toString(36).substring(2, 15);
      const success = await oracleService.processQRCodeConfirmation(trackingCode, confirmationCode);
      
      if (success) {
        const updatedStatus = await oracleService.checkTrackingStatus(trackingCode);
        setDeliveryStatus(updatedStatus);
        onDeliveryConfirmed();
      } else {
        setError('Falha ao confirmar entrega. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao confirmar entrega manualmente:', error);
      setError('Falha ao confirmar entrega. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !deliveryStatus) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        <p className="ml-4 text-lg">Registrando código de rastreio...</p>
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
  
  if (!deliveryStatus) return null;
  
  return (
    <div className="delivery-verification-container bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Verificação de Entrega</h3>
      
      <div className="tracking-details bg-gray-50 p-4 rounded mb-4">
        <p className="text-sm text-gray-600">Código de Rastreio: <span className="font-semibold">{trackingCode}</span></p>
        <p className="text-sm text-gray-600">Transportadora: <span className="font-semibold">{carrier}</span></p>
        <p className="text-sm text-gray-600">Status: <span className="font-semibold">{
          deliveryStatus.status === 'pending' ? 'Pendente' :
          deliveryStatus.status === 'in_transit' ? 'Em Trânsito' :
          deliveryStatus.status === 'delivered' ? 'Entregue' :
          deliveryStatus.status === 'failed' ? 'Falha na Entrega' :
          'Desconhecido'
        }</span></p>
        <p className="text-sm text-gray-600">Última Atualização: <span className="font-semibold">{
          new Date(deliveryStatus.lastUpdate).toLocaleString()
        }</span></p>
        {deliveryStatus.details && (
          <p className="text-sm text-gray-600">Detalhes: <span className="font-semibold">{deliveryStatus.details}</span></p>
        )}
      </div>
      
      {qrCodeUrl && deliveryStatus.status !== 'delivered' && (
        <div className="qr-code-container mb-4">
          <p className="text-sm text-gray-600 mb-2">QR Code para Confirmação de Entrega:</p>
          <div className="flex justify-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`} 
              alt="QR Code para confirmação de entrega" 
              className="w-48 h-48"
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Peça ao entregador para escanear este QR code no momento da entrega
          </p>
        </div>
      )}
      
      <div className={`delivery-status mt-4 p-3 rounded text-center ${
        deliveryStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
        deliveryStatus.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
        deliveryStatus.status === 'delivered' ? 'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800'
      }`}>
        Status: {
          deliveryStatus.status === 'pending' ? 'Aguardando envio' : 
          deliveryStatus.status === 'in_transit' ? 'Em trânsito' : 
          deliveryStatus.status === 'delivered' ? 'Entrega confirmada!' : 
          'Falha na entrega'
        }
      </div>
      
      {deliveryStatus.status !== 'delivered' && (
        <div className="mt-4 flex justify-center">
          <button 
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleManualConfirmation}
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Confirmar Entrega Manualmente'}
          </button>
        </div>
      )}
      
      {deliveryStatus.status === 'delivered' && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <p className="text-green-800 text-center">
            Entrega confirmada! Os fundos serão liberados automaticamente para o vendedor.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryVerificationComponent;
