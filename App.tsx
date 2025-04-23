import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import ProfilePage from './components/pages/ProfilePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import CreateProductPage from './components/pages/CreateProductPage';
import TransactionsPage from './components/pages/TransactionsPage';
import TransactionDetailPage from './components/pages/TransactionDetailPage';
import MessagesPage from './components/pages/MessagesPage';
import ConversationPage from './components/pages/ConversationPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transaction/:id" element={<TransactionDetailPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/conversation/:id" element={<ConversationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
<a href="autenticacao.html" class="inline-block px-6 py-3 rounded-lg bg-[#002D72] hover:bg-[#001d4c] text-white font-bold shadow-md transition-all duration-300 hover:shadow-lg">
  <div class="flex items-center">
    <span class="mr-2">Sistema de Autenticação Anônima</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </div>
</a>
