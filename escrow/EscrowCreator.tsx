import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const EscrowCreator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    buyerAddress: '',
    sellerAddress: '',
    amount: '',
    description: '',
    timelock: '48'
  });

  const [escrowData, setEscrowData] = useState({
    escrowAddress: '',
    redeemScript: '',
    escrowId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de criação de escrow
    // Em uma implementação real, isso chamaria a API Bitcoin para criar o escrow multisig
    const mockEscrowAddress = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
    const mockRedeemScript = '522103a882d414e478039cd5b52a92ffb13dd5e6bd4515497439dffd691a0f12af957521030b4c866585dd868a9d62348a9cd008d6a312937048fff31670e7e920cfc7a74421020f2accaab7a1d30c1a3e73378e0506e3ca4b77bfbd52accb7ba7df0e97baa5ad53ae';
    const mockEscrowId = 'ESC' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    setEscrowData({
      escrowAddress: mockEscrowAddress,
      redeemScript: mockRedeemScript,
      escrowId: mockEscrowId
    });
    
    setStep(2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div>
      {step === 1 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Criar Novo Escrow Multisig</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Endereço Bitcoin do Comprador</label>
                <input
                  type="text"
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                  className="input"
                  placeholder="bc1q..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Endereço Bitcoin do Vendedor</label>
                <input
                  type="text"
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  className="input"
                  placeholder="bc1q..."
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Valor em Bitcoin</label>
              <div className="relative">
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input pl-8"
                  placeholder="0.001"
                  required
                />
                <span className="absolute left-3 top-2 text-gray-500">₿</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Descrição da Transação</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[100px]"
                placeholder="Descreva o produto ou serviço sendo negociado..."
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Período de Timelock</label>
              <select
                name="timelock"
                value={formData.timelock}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="24">24 horas</option>
                <option value="48">48 horas</option>
                <option value="72">72 horas</option>
                <option value="168">1 semana</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Após este período, os fundos podem ser devolvidos ao comprador se não houver acordo.
              </p>
            </div>
            
            <div className="pt-4">
              <button type="submit" className="btn btn-primary w-full py-3">
                Criar Escrow Multisig
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Escrow Criado com Sucesso!</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ID: {escrowData.escrowId}
            </span>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold mb-2">Endereço do Escrow Multisig</h3>
                <div className="flex items-center">
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm break-all">
                    {escrowData.escrowAddress}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(escrowData.escrowAddress)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={escrowData.escrowAddress} size={120} />
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Envie exatamente <strong>{formData.amount} BTC</strong> para o endereço do escrow acima. 
                  Os fundos ficarão bloqueados até que a transação seja concluída.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Detalhes do Escrow</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Comprador</p>
                  <p className="font-medium truncate">{formData.buyerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendedor</p>
                  <p className="font-medium truncate">{formData.sellerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-medium">₿ {formData.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timelock</p>
                  <p className="font-medium">{formData.timelock} horas</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="font-medium">{formData.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setStep(1)} 
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1"
            >
              Voltar
            </button>
            <button 
              onClick={() => window.location.href = `/escrow/${escrowData.escrowId}`} 
              className="btn btn-primary flex-1"
            >
              Ver Status do Escrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowCreator;
