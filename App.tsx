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
