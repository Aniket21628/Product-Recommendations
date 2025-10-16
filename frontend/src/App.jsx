import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, Sparkles, DollarSign, Tag } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      alert('Please enter your preferences');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/recommend`, {
        userInput: userInput
      });

      setRecommendations(response.data.products);
      setMessage(response.data.message);
      setShowAllProducts(false);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setMessage('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setRecommendations([]);
    setMessage('');
    setShowAllProducts(true);
  };

  const displayProducts = showAllProducts ? products : recommendations;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <ShoppingBag size={32} />
            <h1>AI Product Finder</h1>
          </div>
          <p className="tagline">Powered by Gemini 2.0 Flash</p>
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <div className="search-card">
            <div className="search-header">
              <Sparkles size={24} />
              <h2>Tell us what you're looking for</h2>
            </div>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="input-group">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="E.g., I want a phone under $500 with good camera"
                  className="search-input"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <Search size={20} />
                  )}
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {!showAllProducts && (
              <button onClick={handleReset} className="reset-button">
                Show All Products
              </button>
            )}

            <div className="example-queries">
              <p>Try these examples:</p>
              <div className="query-chips">
                <button 
                  className="chip"
                  onClick={() => setUserInput('I want a phone under $500')}
                >
                  Phone under $500
                </button>
                <button 
                  className="chip"
                  onClick={() => setUserInput('Best laptop for programming under $800')}
                >
                  Laptop for coding
                </button>
                <button 
                  className="chip"
                  onClick={() => setUserInput('Wireless headphones with noise cancelling')}
                >
                  Noise cancelling headphones
                </button>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="message-box">
            <Sparkles size={20} />
            <p>{message}</p>
          </div>
        )}

        <div className="products-section">
          <div className="products-header">
            <h2>
              {showAllProducts ? 'All Products' : 'Recommended Products'}
            </h2>
            <span className="product-count">
              {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {displayProducts.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={64} />
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {displayProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-category">
                    <Tag size={14} />
                    {product.category}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-specs">{product.specs}</p>
                  <div className="product-footer">
                    <div className="product-price">
                      <DollarSign size={20} />
                      <span>{product.price}</span>
                    </div>
                    <button className="buy-button">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Built with React, Node.js & Gemini 2.0 Flash API</p>
      </footer>
    </div>
  );
}

export default App;