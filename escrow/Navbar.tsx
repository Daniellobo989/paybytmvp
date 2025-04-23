import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="PayByt Logo" className="h-10 mr-2" />
          <span className="text-xl font-bold">PayByt</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-bitcoin transition-colors">Início</Link>
          <Link to="/escrow" className="hover:text-bitcoin transition-colors">Escrow Multisig</Link>
          <Link to="/marketplace" className="hover:text-bitcoin transition-colors">Marketplace</Link>
          <Link to="/about" className="hover:text-bitcoin transition-colors">Sobre</Link>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-bitcoin">Conectar Carteira</button>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
