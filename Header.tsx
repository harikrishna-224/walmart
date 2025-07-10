import React, { useState, useEffect } from 'react';
import { Search, User, Bell, BarChart3, X, TrendingUp, Package, AlertTriangle, Settings, LogOut, HelpCircle } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShowDetailedAnalytics: () => void;
}

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onShowDetailedAnalytics }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Critical Items Alert',
      message: '8 products are expiring within 3 days. Immediate action required.',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Stock Warning',
      message: 'Organic Milk inventory is running low (5 units remaining).',
      timestamp: '15 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Transfer Complete',
      message: 'Store-to-store transfer of LED Light Bulbs completed successfully.',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Discount Applied',
      message: 'Dynamic discount (40% off) applied to Whole Wheat Bread.',
      timestamp: '2 hours ago',
      read: true
    }
  ]);

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Sample search suggestions
  const allSuggestions = [
    'Organic Milk', 'Wireless Bluetooth Headphones', 'Whole Wheat Bread', 'Greek Yogurt',
    'Power Drill', 'Bananas', 'LED Light Bulbs', 'Cheddar Cheese',
    'Dairy', 'Electronics', 'Groceries', 'Machinery',
    'Aisle 2', 'Electronics Section', 'Bakery Section', 'Hardware Section'
  ];

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const handleProfileAction = (action: string) => {
    setShowProfile(false);
    switch (action) {
      case 'settings':
        alert('Settings panel would open here.\n\nFeatures:\n• Account preferences\n• Notification settings\n• Display options\n• Security settings');
        break;
      case 'help':
        alert('Help & Support\n\nAvailable resources:\n• User manual\n• Video tutorials\n• Contact support\n• FAQ section');
        break;
      case 'logout':
        if (confirm('Are you sure you want to logout?')) {
          window.location.reload();
        }
        break;
    }
  };

  const analyticsData = {
    totalRevenue: 45678,
    totalProducts: 234,
    criticalItems: 8,
    potentialSavings: 3456,
    salesVelocity: 85,
    inventoryTurnover: 12.3
  };

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Walmart Warehouse Management</h1>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, categories, or locations..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <div className="flex space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Analytics */}
            <div className="relative">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              
              {showAnalytics && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Analytics Dashboard</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-blue-600 font-medium">Total Revenue</p>
                            <p className="text-lg font-bold text-blue-800">${analyticsData.totalRevenue.toLocaleString()}</p>
                          </div>
                          <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-green-600 font-medium">Total Products</p>
                            <p className="text-lg font-bold text-green-800">{analyticsData.totalProducts}</p>
                          </div>
                          <Package className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-red-600 font-medium">Critical Items</p>
                            <p className="text-lg font-bold text-red-800">{analyticsData.criticalItems}</p>
                          </div>
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-yellow-600 font-medium">Potential Savings</p>
                            <p className="text-lg font-bold text-yellow-800">${analyticsData.potentialSavings.toLocaleString()}</p>
                          </div>
                          <TrendingUp className="w-6 h-6 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Sales Velocity</span>
                        <span className="text-sm font-medium text-gray-800">{analyticsData.salesVelocity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${analyticsData.salesVelocity}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 mb-2">
                        <span className="text-sm text-gray-600">Inventory Turnover</span>
                        <span className="text-sm font-medium text-gray-800">{analyticsData.inventoryTurnover}x</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Above industry average (10.2x)
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowAnalytics(false);
                        onShowDetailedAnalytics();
                      }}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Detailed Analytics
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Manager</span>
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">JD</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">John Doe</h3>
                        <p className="text-sm text-gray-600">Store Manager</p>
                        <p className="text-xs text-gray-500">Store #1247</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => handleProfileAction('settings')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    
                    <button
                      onClick={() => handleProfileAction('help')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Help & Support</span>
                    </button>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <button
                      onClick={() => handleProfileAction('logout')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdowns when clicking outside */}
      {(showNotifications || showProfile || showAnalytics) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
            setShowAnalytics(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Header;