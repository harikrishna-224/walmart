import React, { useState } from 'react';
import { Product } from '../types/Product';
import { calculateRemainingLifePercentage, getTagInfo, formatDate, getDaysUntilExpiry } from '../utils/dateUtils';
import { getActionRecommendations } from '../utils/recommendations';
import { Navigation, Calendar, Package, MapPin, Lightbulb, X, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  
  const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
  const tagInfo = getTagInfo(remainingLife);
  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
  const recommendations = getActionRecommendations(product);

  const getTagColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleNavigate = () => {
    alert(`Navigation to: ${product.location}\n\nFrom current location: Main Entrance\n→ Walk straight for 50 feet\n→ Turn right at ${product.category} section\n→ Product located at ${product.location}`);
  };

  const executeAction = async (actionType: string, actionTitle: string) => {
    if (executingAction || completedActions.has(actionType)) return;
    
    setExecutingAction(actionType);
    
    // Simulate API call with different durations based on action type
    const duration = actionType === 'donate' ? 3000 : actionType === 'transfer' ? 4000 : 2000;
    
    try {
      await new Promise(resolve => setTimeout(resolve, duration));
      
      // Mark action as completed
      setCompletedActions(prev => new Set([...prev, actionType]));
      
      // Show success message based on action type
      let successMessage = '';
      switch (actionType) {
        case 'donate':
          successMessage = `✅ Donation request submitted for ${product.name}\n\nCharity pickup scheduled for tomorrow.\nTax deduction documentation will be generated.`;
          break;
        case 'transfer':
          successMessage = `✅ Store transfer initiated for ${product.name}\n\nTransfer to high-velocity store approved.\nShipping label generated and logistics notified.`;
          break;
        case 'discount':
          successMessage = `✅ Dynamic discount applied to ${product.name}\n\nPrice updated in system.\nSale tags will be printed automatically.`;
          break;
        case 'priority_sale':
          successMessage = `✅ Priority sale display arranged for ${product.name}\n\nProduct moved to front-of-store display.\nManager's Special signage activated.`;
          break;
        default:
          successMessage = `✅ Action "${actionTitle}" completed successfully for ${product.name}`;
      }
      
      alert(successMessage);
      
    } catch (error) {
      alert(`❌ Failed to execute action: ${actionTitle}\n\nPlease try again or contact IT support.`);
    } finally {
      setExecutingAction(null);
    }
  };

  const getActionButtonState = (actionType: string) => {
    if (completedActions.has(actionType)) {
      return {
        disabled: true,
        text: 'Completed',
        className: 'bg-green-600 text-white cursor-not-allowed opacity-75'
      };
    }
    
    if (executingAction === actionType) {
      return {
        disabled: true,
        text: 'Processing...',
        className: 'bg-blue-500 text-white cursor-not-allowed'
      };
    }
    
    if (executingAction && executingAction !== actionType) {
      return {
        disabled: true,
        text: 'Apply Action',
        className: 'bg-gray-400 text-white cursor-not-allowed opacity-50'
      };
    }
    
    return {
      disabled: false,
      text: 'Apply Action',
      className: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
    };
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tagInfo.color)}`}>
            {tagInfo.label}
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {Math.round(remainingLife)}% remaining
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
            <span className="text-lg font-bold text-blue-600">${product.price}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Package className="w-4 h-4 mr-2" />
              <span>Qty: {product.quantity} | Batch: {product.batchNumber}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Expires: {formatDate(product.expiryDate)} ({daysUntilExpiry} days)</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">{product.location}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleNavigate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Navigate
            </button>
            
            <button 
              onClick={() => setShowRecommendations(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Actions
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Modal */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Action Recommendations</h3>
              <button 
                onClick={() => setShowRecommendations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">{product.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Remaining Life: {Math.round(remainingLife)}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTagColor(tagInfo.color)}`}>
                    {tagInfo.label}
                  </span>
                </div>
              </div>
              
              {executingAction && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Processing action... Please wait.</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const buttonState = getActionButtonState(rec.type);
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getUrgencyIcon(rec.urgency)}
                          <h5 className="font-medium text-gray-800">{rec.title}</h5>
                        </div>
                        {rec.estimatedSavings && (
                          <span className="text-green-600 font-medium text-sm">
                            Save ${rec.estimatedSavings.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          rec.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.urgency} priority
                        </span>
                        <button 
                          onClick={() => executeAction(rec.type, rec.title)}
                          disabled={buttonState.disabled}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${buttonState.className}`}
                        >
                          {executingAction === rec.type && (
                            <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                          )}
                          {completedActions.has(rec.type) && (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {buttonState.text}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {completedActions.size > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h6 className="font-medium text-green-800 mb-2">Completed Actions</h6>
                  <p className="text-sm text-green-700">
                    {completedActions.size} action{completedActions.size > 1 ? 's' : ''} completed successfully. 
                    Changes will be reflected in the system within 5-10 minutes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;