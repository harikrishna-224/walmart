import React from 'react';
import { TrendingUp, Package, AlertTriangle, Users } from 'lucide-react';

interface WelcomeSectionProps {
  totalProducts: number;
  criticalProducts: number;
  potentialSavings: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  totalProducts, 
  criticalProducts, 
  potentialSavings 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, Store Manager!</h2>
          <p className="text-blue-100 text-lg">
            Your warehouse management dashboard is ready. Monitor expiry dates, optimize inventory, and maximize profitability.
          </p>
        </div>
        <div className="hidden md:block">
          <Users className="w-16 h-16 text-blue-200" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Critical Items</p>
              <p className="text-2xl font-bold text-red-300">{criticalProducts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-300" />
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Potential Savings</p>
              <p className="text-2xl font-bold text-green-300">${potentialSavings.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;