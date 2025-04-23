import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre o PayByt</h3>
            <p className="text-sm">
              O PayByt é um marketplace descentralizado que utiliza Bitcoin como única forma de pagamento, 
              garantindo privacidade, segurança e liberdade nas transações.
            </p>
          </div>
          
          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-accent-400">Início</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-accent-400">Produtos</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-accent-400">Como Funciona</Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-accent-400">Perguntas Frequentes</Link>
              </li>
            </ul>
          </div>
          
          {/* Coluna 3 - Recursos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bitcoin-guide" className="text-sm hover:text-accent-400">Guia Bitcoin</Link>
              </li>
              <li>
                <Link to="/security" className="text-sm hover:text-accent-400">Segurança</Link>
              </li>
              <li>
                <Link to="/escrow" className="text-sm hover:text-accent-400">Sistema Escrow</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-accent-400">Privacidade</Link>
              </li>
            </ul>
          </div>
          
          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-sm mb-2">
              Tem alguma dúvida ou sugestão?
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-accent-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-600 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
        
        {/* Linha de Copyright */}
        <div className="border-t border-primary-400 mt-8 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PayByt. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
