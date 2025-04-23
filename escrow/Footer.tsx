import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PayByt</h3>
            <p className="text-gray-300">
              Marketplace descentralizado com Bitcoin como única forma de pagamento.
              Compre e venda com segurança usando nosso sistema de escrow multisig.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-bitcoin transition-colors">Início</a></li>
              <li><a href="/escrow" className="text-gray-300 hover:text-bitcoin transition-colors">Escrow Multisig</a></li>
              <li><a href="/marketplace" className="text-gray-300 hover:text-bitcoin transition-colors">Marketplace</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-bitcoin transition-colors">Sobre</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: contato@paybyt.com</li>
              <li>Twitter: @paybyt</li>
              <li>GitHub: github.com/paybyt</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PayByt. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
