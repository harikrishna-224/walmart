import React, { useState, useMemo } from 'react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import TagFilter from './components/TagFilter';
import ProductCard from './components/ProductCard';
import PDFGenerator from './components/PDFGenerator';
import DetailedAnalytics from './components/DetailedAnalytics';
import NotificationSystem from './components/NotificationSystem';
import { products } from './data/products';
import { calculateRemainingLifePercentage, getTagInfo } from './utils/dateUtils';
import { calculatePotentialSavings } from './utils/recommendations';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; storeId: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  const handleLogin = (credentials: { username: string; password: string; storeId: string }) => {
    setUserInfo({ username: credentials.username, storeId: credentials.storeId });
    setIsLoggedIn(true);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(product => {
        const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
        const tagInfo = getTagInfo(remainingLife);
        return tagInfo.color === selectedTag;
      });
    }

    return filtered;
  }, [searchTerm, selectedTag]);

  const productCounts = useMemo(() => {
    const counts = { all: products.length, red: 0, yellow: 0, green: 0 };
    
    products.forEach(product => {
      const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
      const tagInfo = getTagInfo(remainingLife);
      counts[tagInfo.color]++;
    });
    
    return counts;
  }, []);

  const criticalProducts = productCounts.red;
  const potentialSavings = calculatePotentialSavings(products);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        onShowDetailedAnalytics={() => setShowDetailedAnalytics(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection 
          totalProducts={products.length}
          criticalProducts={criticalProducts}
          potentialSavings={potentialSavings}
        />
        
        <div className="flex justify-between items-center mb-6">
          <TagFilter 
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            productCounts={productCounts}
          />
          
          <PDFGenerator products={filteredProducts} selectedTag={selectedTag} />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {selectedTag === 'all' ? 'All Products' : `${selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1)} Tagged Products`}
          </h3>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchTerm ? 'No products found matching your search.' : 'No products found for this tag.'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Notification System */}
      <NotificationSystem products={products} />

      {/* Detailed Analytics Modal */}
      {showDetailedAnalytics && (
        <DetailedAnalytics 
          products={products} 
          onClose={() => setShowDetailedAnalytics(false)} 
        />
      )}
    </div>
  );
}

export default App;