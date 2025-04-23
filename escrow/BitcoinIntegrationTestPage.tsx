import React, { useState } from 'react';
import BitcoinPaymentComponent from './BitcoinPaymentComponent';
import LightningPaymentComponent from './LightningPaymentComponent';
import EscrowManagerComponent from './EscrowManagerComponent';

const BitcoinIntegrationTestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bitcoin' | 'lightning' | 'escrow'>('bitcoin');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Teste de Integração Bitcoin</h1>
        
        {/* Abas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('bitcoin')}
              className={`pb-3 px-1 ${
                activeTab === 'bitcoin'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bitcoin On-Chain
            </button>
            <button
              onClick={() => setActiveTab('lightning')}
              className={`pb-3 px-1 ${
                activeTab === 'lightning'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lightning Network
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`pb-3 px-1 ${
                activeTab === 'escrow'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Escrow Multisig
            </button>
          </nav>
        </div>
        
        {/* Conteúdo da aba ativa */}
        <div>
          {activeTab === 'bitcoin' && <BitcoinPaymentComponent />}
          {activeTab === 'lightning' && <LightningPaymentComponent />}
          {activeTab === 'escrow' && <EscrowManagerComponent />}
        </div>
      </div>
    </div>
  );
};

export default BitcoinIntegrationTestPage;
