import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketplace Descentralizado com Bitcoin</h1>
          <p className="text-xl mb-8">Compre e venda com segurança usando nosso sistema de escrow multisig. Sem intermediários, sem KYC, apenas Bitcoin.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/escrow" className="btn btn-bitcoin text-lg px-6 py-3">
              Experimentar Escrow Multisig
            </Link>
            <Link to="/marketplace" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-6 py-3">
              Explorar Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Por que escolher o PayByt?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-bitcoin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Escrow Multisig Seguro</h3>
            <p className="text-gray-600">Nosso sistema de escrow multisig 2-de-3 garante que seus fundos estejam sempre protegidos durante as transações.</p>
          </div>
          <div className="card">
            <div className="text-bitcoin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">100% Descentralizado</h3>
            <p className="text-gray-600">Sem intermediários, sem KYC, sem controle central. Apenas você, a contraparte e a blockchain do Bitcoin.</p>
          </div>
          <div className="card">
            <div className="text-bitcoin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Network</h3>
            <p className="text-gray-600">Suporte à Lightning Network para transações instantâneas e com taxas mínimas para compras de menor valor.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-xl text-gray-600 mb-6">Experimente nosso sistema de escrow multisig com Bitcoin e descubra uma nova forma de comprar e vender online.</p>
        <Link to="/escrow" className="btn btn-primary text-lg px-6 py-3">
          Criar Escrow Multisig
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
