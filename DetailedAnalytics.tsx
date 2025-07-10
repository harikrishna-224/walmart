import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Package, AlertTriangle, DollarSign, Calendar, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import { Product } from '../types/Product';
import { calculateRemainingLifePercentage, getTagInfo, getDaysUntilExpiry } from '../utils/dateUtils';

interface DetailedAnalyticsProps {
  products: Product[];
  onClose: () => void;
}

const DetailedAnalytics: React.FC<DetailedAnalyticsProps> = ({ products, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    
    const tagStats = { red: 0, yellow: 0, green: 0 };
    const categoryStats: { [key: string]: number } = {};
    const expiryDistribution: { [key: string]: number } = {};
    const valueAtRisk = { red: 0, yellow: 0, green: 0 };
    
    products.forEach(product => {
      const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
      const tagInfo = getTagInfo(remainingLife);
      const daysLeft = getDaysUntilExpiry(product.expiryDate);
      const productValue = product.price * product.quantity;
      
      tagStats[tagInfo.color]++;
      valueAtRisk[tagInfo.color] += productValue;
      
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
      
      if (daysLeft <= 7) expiryDistribution['0-7 days'] = (expiryDistribution['0-7 days'] || 0) + 1;
      else if (daysLeft <= 14) expiryDistribution['8-14 days'] = (expiryDistribution['8-14 days'] || 0) + 1;
      else if (daysLeft <= 30) expiryDistribution['15-30 days'] = (expiryDistribution['15-30 days'] || 0) + 1;
      else expiryDistribution['30+ days'] = (expiryDistribution['30+ days'] || 0) + 1;
    });

    const criticalPercentage = (tagStats.red / products.length) * 100;
    const warningPercentage = (tagStats.yellow / products.length) * 100;
    const healthScore = 100 - criticalPercentage - (warningPercentage * 0.5);

    return {
      totalValue,
      totalQuantity,
      tagStats,
      categoryStats,
      expiryDistribution,
      valueAtRisk,
      criticalPercentage,
      warningPercentage,
      healthScore,
      averagePrice: totalValue / totalQuantity,
      topCategories: Object.entries(categoryStats).sort(([,a], [,b]) => b - a).slice(0, 5)
    };
  }, [products]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'expiry', label: 'Expiry Analysis', icon: Calendar },
    { id: 'financial', label: 'Financial Impact', icon: DollarSign },
    { id: 'categories', label: 'Categories', icon: Package }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-800">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-green-800">${analytics.totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Critical Items</p>
              <p className="text-2xl font-bold text-red-800">{analytics.tagStats.red}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Health Score</p>
              <p className="text-2xl font-bold text-purple-800">{analytics.healthScore.toFixed(1)}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Health Score Breakdown */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Inventory Health Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-700">Good Condition</span>
              <span className="text-sm text-green-700">{analytics.tagStats.green} items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full" 
                style={{ width: `${(analytics.tagStats.green / products.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-yellow-700">Warning</span>
              <span className="text-sm text-yellow-700">{analytics.tagStats.yellow} items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-yellow-500 h-3 rounded-full" 
                style={{ width: `${(analytics.tagStats.yellow / products.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-red-700">Critical</span>
              <span className="text-sm text-red-700">{analytics.tagStats.red} items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full" 
                style={{ width: `${(analytics.tagStats.red / products.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpiryAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Expiry Timeline</h3>
          <div className="space-y-3">
            {Object.entries(analytics.expiryDistribution).map(([period, count]) => (
              <div key={period} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{period}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / products.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Action Required</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-800">Immediate Action</span>
              </div>
              <p className="text-sm text-red-700">{analytics.tagStats.red} items need immediate attention</p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-yellow-800">Monitor Closely</span>
              </div>
              <p className="text-sm text-yellow-700">{analytics.tagStats.yellow} items require monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialImpact = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Critical Value at Risk</h3>
          <p className="text-3xl font-bold text-red-600">${analytics.valueAtRisk.red.toLocaleString()}</p>
          <p className="text-sm text-red-600 mt-1">Immediate action required</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Warning Value</h3>
          <p className="text-3xl font-bold text-yellow-600">${analytics.valueAtRisk.yellow.toLocaleString()}</p>
          <p className="text-sm text-yellow-600 mt-1">Monitor and plan actions</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Stable Value</h3>
          <p className="text-3xl font-bold text-green-600">${analytics.valueAtRisk.green.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">Good condition</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Financial Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <Target className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Potential Savings</p>
              <p className="text-sm text-blue-700">Implement dynamic pricing to recover ${(analytics.valueAtRisk.red * 0.3).toLocaleString()} from critical items</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Revenue Optimization</p>
              <p className="text-sm text-green-700">Transfer high-value items to high-velocity stores to maximize sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
        <div className="space-y-3">
          {analytics.topCategories.map(([category, count]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="text-sm font-medium">{category}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(count / products.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Detailed Analytics Dashboard</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'expiry' && renderExpiryAnalysis()}
          {activeTab === 'financial' && renderFinancialImpact()}
          {activeTab === 'categories' && renderCategories()}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;