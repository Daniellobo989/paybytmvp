import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  // Estado para controlar se o usuário está logado (simplificado para o MVP)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Estado para controlar o menu mobile
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Função para alternar o menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-10" src={logo} alt="PayByt Logo" />
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-primary-500 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                Início
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                Produtos
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                Como Funciona
              </Link>
              {isLoggedIn ? (
                <>
                  <Link to="/transactions" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                    Transações
                  </Link>
                  <Link to="/messages" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                    Mensagens
                  </Link>
                  <div className="relative ml-3">
                    <Link to="/profile" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                      Meu Perfil
                    </Link>
                  </div>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                    Entrar
                  </Link>
                  <Link to="/register" className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-md text-sm font-medium">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Menu Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-primary-500 hover:text-primary-700 block px-3 py-2 rounded-md text-base font-medium">
            Início
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
            Produtos
          </Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
            Como Funciona
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/transactions" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
                Transações
              </Link>
              <Link to="/messages" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
                Mensagens
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
                Meu Perfil
              </Link>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium">
                Entrar
              </Link>
              <Link to="/register" className="bg-primary-500 text-white hover:bg-primary-600 block px-3 py-2 rounded-md text-base font-medium">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
