import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

// Componentes para o sistema de escrow multisig
import EscrowCreator from '../components/escrow/EscrowCreator';
import EscrowViewer from '../components/escrow/EscrowViewer';
import EscrowHistory from '../components/escrow/EscrowHistory';

const EscrowPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sistema de Escrow Multisig com Bitcoin</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Realize transações seguras usando nosso sistema de escrow multisig 2-de-3.
          Seus fundos permanecem protegidos até que ambas as partes concordem com a conclusão da transação.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex bg-gray-100 p-2 space-x-2">
            <Tab className={({ selected }) =>
              `flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                selected 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }>
              Criar Escrow
            </Tab>
            <Tab className={({ selected }) =>
              `flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                selected 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }>
              Visualizar Escrow
            </Tab>
            <Tab className={({ selected }) =>
              `flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                selected 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }>
              Histórico
            </Tab>
          </Tab.List>
          <Tab.Panels className="p-6">
            <Tab.Panel>
              <EscrowCreator />
            </Tab.Panel>
            <Tab.Panel>
              <EscrowViewer />
            </Tab.Panel>
            <Tab.Panel>
              <EscrowHistory />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-12 bg-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Como funciona o Escrow Multisig?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Criação do Escrow</h3>
            <p className="text-gray-600">O comprador cria um escrow multisig 2-de-3 com as chaves do comprador, vendedor e mediador (PayByt).</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Depósito de Fundos</h3>
            <p className="text-gray-600">O comprador deposita Bitcoin no endereço multisig. Os fundos ficam bloqueados até a conclusão da transação.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Liberação de Fundos</h3>
            <p className="text-gray-600">Após receber o produto/serviço, o comprador libera os fundos para o vendedor. Em caso de disputa, o mediador intervém.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowPage;
