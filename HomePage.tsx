import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Tipo para os produtos
interface Product {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  seller: {
    id: string;
    email_hash: string;
    reputation: {
      rating: number;
      total_transactions: number;
    };
  };
  images: Array<{
    url: string;
    hash: string;
  }>;
  category: string;
  status: string;
  created_at: string;
}

// Componente de card de produto
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Função para formatar preço em Bitcoin/Sats
  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    } else {
      return `${amount.toLocaleString()} sats`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0].url} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded-md text-xs font-medium">
          {formatPrice(product.price.amount, product.price.currency)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">Vendedor:</span>
            <div className="flex items-center">
              <span className="text-xs font-medium text-primary-500">
                {product.seller.email_hash.substring(0, 8)}...
              </span>
              <div className="ml-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-600">{product.seller.reputation.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <Link 
          to={`/product/${product.id}`} 
          className="mt-3 block w-full text-center bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

// Componente de filtros
const ProductFilters: React.FC<{
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onSortChange: (sort: string) => void;
}> = ({ categories, selectedCategory, onCategoryChange, onPriceRangeChange, onSortChange }) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    onSortChange(newSort);
  };

  const handlePriceFilter = () => {
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : 0;
    if (max > 0 && min <= max) {
      onPriceRangeChange(min, max);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
      
      {/* Categorias */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Categorias</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <input
              id="category-all"
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="h-4 w-4 text-primary-500 focus:ring-primary-400"
            />
            <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
              Todas
            </label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-400"
              />
              <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Faixa de preço */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Faixa de Preço (sats)</h4>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={handlePriceFilter}
          className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 rounded-md text-sm transition-colors"
        >
          Aplicar
        </button>
      </div>
      
      {/* Ordenação */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Ordenar por</h4>
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="rating">Melhor avaliação</option>
        </select>
      </div>
    </div>
  );
};

// Componente principal da página inicial
const HomePage: React.FC = () => {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dados de exemplo para o MVP
  useEffect(() => {
    // Simulando uma chamada de API
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'Smartphone Samsung Galaxy S21',
          description: 'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, 8GB de RAM, tela AMOLED de 6.2 polegadas.',
          price: {
            amount: 15000000,
            currency: 'SATS'
          },
          seller: {
            id: '101',
            email_hash: 'a1b2c3d4e5f6g7h8i9j0',
            reputation: {
              rating: 4.8,
              total_transactions: 56
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Samsung+Galaxy+S21',
              hash: 'hash1'
            }
          ],
          category: 'Eletrônicos',
          status: 'active',
          created_at: '2025-04-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Notebook Dell XPS 13',
          description: 'Notebook Dell XPS 13 com processador Intel Core i7, 16GB de RAM, SSD de 512GB e tela de 13.4 polegadas.',
          price: {
            amount: 45000000,
            currency: 'SATS'
          },
          seller: {
            id: '102',
            email_hash: 'b2c3d4e5f6g7h8i9j0k1',
            reputation: {
              rating: 4.9,
              total_transactions: 32
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Dell+XPS+13',
              hash: 'hash2'
            }
          ],
          category: 'Eletrônicos',
          status: 'active',
          created_at: '2025-04-14T14:45:00Z'
        },
        {
          id: '3',
          title: 'Tênis Nike Air Max',
          description: 'Tênis Nike Air Max, tamanho 42, cor preta, novo na caixa.',
          price: {
            amount: 5000000,
            currency: 'SATS'
          },
          seller: {
            id: '103',
            email_hash: 'c3d4e5f6g7h8i9j0k1l2',
            reputation: {
              rating: 4.6,
              total_transactions: 18
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Nike+Air+Max',
              hash: 'hash3'
            }
          ],
          category: 'Moda',
          status: 'active',
          created_at: '2025-04-16T09:15:00Z'
        },
        {
          id: '4',
          title: 'Livro: Dominando Bitcoin',
          description: 'Livro "Dominando Bitcoin" de Andreas M. Antonopoulos, edição atualizada, em português.',
          price: {
            amount: 2000000,
            currency: 'SATS'
          },
          seller: {
            id: '104',
            email_hash: 'd4e5f6g7h8i9j0k1l2m3',
            reputation: {
              rating: 5.0,
              total_transactions: 27
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Dominando+Bitcoin',
              hash: 'hash4'
            }
          ],
          category: 'Livros',
          status: 'active',
          created_at: '2025-04-17T16:20:00Z'
        },
        {
          id: '5',
          title: 'Câmera Canon EOS R5',
          description: 'Câmera Canon EOS R5 mirrorless com lente 24-105mm, 45MP, gravação 8K, estabilização de imagem.',
          price: {
            amount: 80000000,
            currency: 'SATS'
          },
          seller: {
            id: '105',
            email_hash: 'e5f6g7h8i9j0k1l2m3n4',
            reputation: {
              rating: 4.7,
              total_transactions: 41
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Canon+EOS+R5',
              hash: 'hash5'
            }
          ],
          category: 'Eletrônicos',
          status: 'active',
          created_at: '2025-04-13T11:10:00Z'
        },
        {
          id: '6',
          title: 'Mesa de Escritório',
          description: 'Mesa de escritório em L, cor carvalho, com 150x170cm, nova.',
          price: {
            amount: 12000000,
            currency: 'SATS'
          },
          seller: {
            id: '106',
            email_hash: 'f6g7h8i9j0k1l2m3n4o5',
            reputation: {
              rating: 4.5,
              total_transactions: 12
            }
          },
          images: [
            {
              url: 'https://via.placeholder.com/300x300.png?text=Mesa+Escritorio',
              hash: 'hash6'
            }
          ],
          category: 'Casa e Decoração',
          status: 'active',
          created_at: '2025-04-18T08:30:00Z'
        }
      ];

      // Extrair categorias únicas
      const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setCategories(uniqueCategories);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrar produtos por categoria
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(category, searchTerm);
  };

  // Filtrar produtos por preço
  const handlePriceRangeChange = (min: number, max: number) => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered = filtered.filter(p => p.price.amount >= min && p.price.amount <= max);
    
    setFilteredProducts(filtered);
  };

  // Ordenar produtos
  const handleSortChange = (sort: string) => {
    let sorted = [...filteredProducts];
    
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price_asc':
        sorted.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'rating':
        sorted.sort((a, b) => b.seller.reputation.rating - a.seller.reputation.rating);
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  };

  // Filtrar produtos por termo de busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts(selectedCategory, searchTerm);
  };

  // Função auxiliar para filtrar produtos
  const filterProducts = (category: string, search: string) => {
    let filtered = [...products];
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <div>
      {/* Banner Hero */}
      <div className="bg-primary-500 text-white py-12 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Marketplace Descentralizado com Bitcoin
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Compre e venda produtos com total privacidade e segurança utilizando Bitcoin como forma de pagamento.
          </p>
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex">
              <input
(Content truncated due to size limit. Use line ranges to read in chunks)