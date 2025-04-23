import React, { useState } from 'react';

// Tipos para testes de segurança
interface SecurityTest {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
}

const SecurityTestPage: React.FC = () => {
  const [tests, setTests] = useState<SecurityTest[]>([
    {
      id: 'test_1',
      name: 'Validação de Endereços Bitcoin',
      description: 'Verifica se o sistema valida corretamente os formatos de endereços Bitcoin (Legacy, SegWit, Bech32).',
      status: 'pending'
    },
    {
      id: 'test_2',
      name: 'Segurança do Escrow Multisig',
      description: 'Testa a criação, financiamento e liberação de fundos em endereços multisig 2-de-3.',
      status: 'pending'
    },
    {
      id: 'test_3',
      name: 'Verificação de Pagamentos',
      description: 'Verifica se o sistema detecta corretamente pagamentos recebidos em endereços Bitcoin.',
      status: 'pending'
    },
    {
      id: 'test_4',
      name: 'Validação de Invoices Lightning',
      description: 'Testa a geração e validação de invoices Lightning Network.',
      status: 'pending'
    },
    {
      id: 'test_5',
      name: 'Proteção contra Double-Spending',
      description: 'Verifica se o sistema está protegido contra ataques de double-spending.',
      status: 'pending'
    },
    {
      id: 'test_6',
      name: 'Segurança de Chaves Privadas',
      description: 'Testa o armazenamento seguro e a não-exposição de chaves privadas.',
      status: 'pending'
    },
    {
      id: 'test_7',
      name: 'Anonimato de Usuários',
      description: 'Verifica se o sistema mantém o anonimato dos usuários conforme especificado.',
      status: 'pending'
    },
    {
      id: 'test_8',
      name: 'Criptografia de Mensagens',
      description: 'Testa a criptografia de ponta a ponta nas mensagens entre usuários.',
      status: 'pending'
    }
  ]);
  
  const [runningTests, setRunningTests] = useState<boolean>(false);
  
  // Função para executar todos os testes
  const runAllTests = async () => {
    setRunningTests(true);
    
    // Atualizar status de todos os testes para "running"
    setTests(tests.map(test => ({ ...test, status: 'running' as const })));
    
    // Executar testes sequencialmente
    for (let i = 0; i < tests.length; i++) {
      // Atualizar apenas o teste atual
      setTests(prevTests => {
        const newTests = [...prevTests];
        newTests[i] = { ...newTests[i], status: 'running' };
        return newTests;
      });
      
      // Simular execução do teste (1-3 segundos)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simular resultado (80% de chance de passar)
      const passed = Math.random() > 0.2;
      
      // Atualizar resultado do teste
      setTests(prevTests => {
        const newTests = [...prevTests];
        newTests[i] = { 
          ...newTests[i], 
          status: passed ? 'passed' : 'failed',
          result: passed 
            ? 'Teste passou com sucesso.' 
            : 'Falha no teste. Verifique os logs para mais detalhes.'
        };
        return newTests;
      });
    }
    
    setRunningTests(false);
  };
  
  // Função para executar um teste específico
  const runTest = async (testId: string) => {
    // Encontrar índice do teste
    const testIndex = tests.findIndex(test => test.id === testId);
    if (testIndex === -1) return;
    
    // Atualizar status do teste para "running"
    setTests(prevTests => {
      const newTests = [...prevTests];
      newTests[testIndex] = { ...newTests[testIndex], status: 'running' };
      return newTests;
    });
    
    // Simular execução do teste (1-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simular resultado (80% de chance de passar)
    const passed = Math.random() > 0.2;
    
    // Atualizar resultado do teste
    setTests(prevTests => {
      const newTests = [...prevTests];
      newTests[testIndex] = { 
        ...newTests[testIndex], 
        status: passed ? 'passed' : 'failed',
        result: passed 
          ? 'Teste passou com sucesso.' 
          : 'Falha no teste. Verifique os logs para mais detalhes.'
      };
      return newTests;
    });
  };
  
  // Função para obter classe de status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Função para obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'running':
        return (
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'passed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'failed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Testes de Segurança</h1>
        
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Execute testes de segurança para verificar a integridade e segurança do sistema de pagamento Bitcoin.
          </p>
          <button
            onClick={runAllTests}
            disabled={runningTests}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {runningTests ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executando Testes...
              </span>
            ) : (
              'Executar Todos os Testes'
            )}
          </button>
        </div>
        
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{test.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                      {getStatusIcon(test.status)}
                      <span className="ml-1">
                        {test.status === 'pending' && 'Pendente'}
                        {test.status === 'running' && 'Executando'}
                        {test.status === 'passed' && 'Passou'}
                        {test.status === 'failed' && 'Falhou'}
                      </span>
                    </span>
                    <button
                      onClick={() => runTest(test.id)}
                      disabled={runningTests || test.status === 'running'}
                      className="ml-3 text-primary-500 hover:text-primary-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      {test.status === 'running' ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {test.result && (
                  <div className={`mt-3 p-3 rounded-md ${test.status === 'passed' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm ${test.status === 'passed' ? 'text-green-700' : 'text-red-700'}`}>
                      {test.result}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Estes testes simulam a verificação de segurança do sistema de pagamento Bitcoin do PayByt. Em um ambiente de produção, testes mais abrangentes e automatizados seriam implementados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTestPage;
