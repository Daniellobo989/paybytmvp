import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('');
  const [lightningAddress, setLightningAddress] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    // Avançar para o próximo passo
    setError('');
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bitcoinAddress) {
      setError('O endereço Bitcoin é obrigatório');
      return;
    }
    
    if (!termsAccepted) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Simulando registro para o MVP
    try {
      // Aqui seria a chamada real para a API de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular sucesso
      // Armazenar token de autenticação (simplificado para o MVP)
      localStorage.setItem('paybyt_auth', 'dummy_token');
      
      // Redirecionar para a página inicial
      window.location.href = '/';
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar Conta no PayByt</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="seu@email.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Seu email será armazenado apenas como um hash criptográfico para garantir sua privacidade.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="••••••••"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use uma senha forte com pelo menos 8 caracteres, incluindo letras, números e símbolos.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors"
              >
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="bitcoinAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Bitcoin
                </label>
                <input
                  id="bitcoinAddress"
                  type="text"
                  value={bitcoinAddress}
                  onChange={(e) => setBitcoinAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="bc1q..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Este endereço será usado para receber pagamentos das suas vendas.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="lightningAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Lightning (opcional)
                </label>
                <input
                  id="lightningAddress"
                  type="text"
                  value={lightningAddress}
                  onChange={(e) => setLightningAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="lnbc..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Para receber pagamentos instantâneos via Lightning Network.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    Eu li e aceito os <Link to="/terms" className="text-primary-500 hover:text-primary-700">Termos de Uso</Link> e <Link to="/privacy" className="text-primary-500 hover:text-primary-700">Política de Privacidade</Link>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium transition-colors"
                  disabled={isLoading || !termsAccepted}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando conta...
                    </span>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-700 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4">
          <div className="text-xs text-gray-500 text-center">
            <p>
              O PayByt é um marketplace descentralizado que utiliza Bitcoin como única forma de pagamento.
            </p>
          </div>
        </div>
      </div>
      
      {/* Informações de Segurança */}
      <div className="mt-8 bg-primary-50 p-4 rounded-lg">
        <h2 className="text-sm font-semibold text-primary-700 mb-2">Por que escolher o PayByt?</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-xs text-gray-600">
                Transações seguras com sistema de escrow multisig 2-de-3.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-xs text-gray-600">
                Privacidade total com cadastro anônimo e comunicações criptografadas.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <p className="text-xs text-gray-600">
                Suporte a pagamentos on-chain e Lightning Network para maior flexibilidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
