import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BitcoinIntegrationTestPage from './BitcoinIntegrationTestPage';
import SecurityTestPage from './SecurityTestPage';
import FunctionalTestPage from './FunctionalTestPage';

const TestDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bitcoin' | 'security' | 'functional'>('bitcoin');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Testes do PayByt</h1>
        
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
              Integração Bitcoin
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-1 ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Testes de Segurança
            </button>
            <button
              onClick={() => setActiveTab('functional')}
              className={`pb-3 px-1 ${
                activeTab === 'functional'
                  ? 'border-b-2 border-primary-500 text-primary-500 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Testes Funcionais
            </button>
          </nav>
        </div>
        
        {/* Conteúdo da aba ativa */}
        <div>
          {activeTab === 'bitcoin' && <BitcoinIntegrationTestPage />}
          {activeTab === 'security' && <SecurityTestPage />}
          {activeTab === 'functional' && <FunctionalTestPage />}
        </div>
        
        <div className="mt-8 flex justify-end">
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors mr-3"
          >
            Voltar para Início
          </Link>
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Gerar Relatório de Testes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDashboardPage;
