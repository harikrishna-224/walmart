import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X, Bell } from 'lucide-react';
import { Product } from '../types/Product';
import { calculateRemainingLifePercentage, getTagInfo, getDaysUntilExpiry } from '../utils/dateUtils';

interface NotificationSystemProps {
  products: Product[];
}

interface SystemNotification {
  id: string;
  type: 'critical' | 'warning' | 'reminder';
  title: string;
  message: string;
  productId?: string;
  timestamp: Date;
  dismissed: boolean;
  actionTaken: boolean;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ products }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [criticalAlertDismissed, setCriticalAlertDismissed] = useState(false);

  // Generate notifications based on product status
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: SystemNotification[] = [];
      const now = new Date();

      products.forEach(product => {
        const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
        const tagInfo = getTagInfo(remainingLife);
        const daysLeft = getDaysUntilExpiry(product.expiryDate);

        // Critical notifications (red tag items)
        if (tagInfo.color === 'red') {
          newNotifications.push({
            id: `critical-${product.id}-${Date.now()}`,
            type: 'critical',
            title: 'URGENT: Critical Item Alert',
            message: `${product.name} expires in ${daysLeft} days. Immediate action required to prevent loss of $${(product.price * product.quantity).toFixed(2)}.`,
            productId: product.id,
            timestamp: now,
            dismissed: false,
            actionTaken: false
          });
        }

        // Warning notifications (yellow tag items)
        if (tagInfo.color === 'yellow' && daysLeft <= 14) {
          newNotifications.push({
            id: `warning-${product.id}-${Date.now()}`,
            type: 'warning',
            title: 'Warning: Item Approaching Expiry',
            message: `${product.name} expires in ${daysLeft} days. Consider applying discount or transfer to high-velocity store.`,
            productId: product.id,
            timestamp: now,
            dismissed: false,
            actionTaken: false
          });
        }

        // Zero days prevention
        if (daysLeft <= 1 && daysLeft > 0) {
          newNotifications.push({
            id: `emergency-${product.id}-${Date.now()}`,
            type: 'critical',
            title: 'EMERGENCY: Item Expires Tomorrow',
            message: `${product.name} expires tomorrow! Emergency action required - donate, discount heavily, or remove from inventory.`,
            productId: product.id,
            timestamp: now,
            dismissed: false,
            actionTaken: false
          });
        }
      });

      // Add system reminders for unactioned items
      const criticalItems = products.filter(p => {
        const remainingLife = calculateRemainingLifePercentage(p.manufacturingDate, p.expiryDate);
        return getTagInfo(remainingLife).color === 'red';
      });

      if (criticalItems.length > 0) {
        newNotifications.push({
          id: `reminder-${Date.now()}`,
          type: 'reminder',
          title: 'Daily Reminder: Critical Items',
          message: `You have ${criticalItems.length} critical items requiring immediate attention. Review and take action to minimize losses.`,
          timestamp: now,
          dismissed: false,
          actionTaken: false
        });
      }

      setNotifications(prev => {
        // Merge with existing notifications, avoiding duplicates
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew].slice(-20); // Keep only last 20 notifications
      });
    };

    generateNotifications();

    // Set up periodic notifications for critical items
    const interval = setInterval(() => {
      const criticalItems = products.filter(p => {
        const remainingLife = calculateRemainingLifePercentage(p.manufacturingDate, p.expiryDate);
        return getTagInfo(remainingLife).color === 'red';
      });

      if (criticalItems.length > 0) {
        const reminderNotification: SystemNotification = {
          id: `periodic-reminder-${Date.now()}`,
          type: 'reminder',
          title: 'Periodic Reminder: Action Required',
          message: `${criticalItems.length} critical items still need attention. Don't let inventory expire!`,
          timestamp: new Date(),
          dismissed: false,
          actionTaken: false
        };

        setNotifications(prev => [...prev, reminderNotification].slice(-20));
      }
    }, 30000); // Every 30 seconds for demo (in production, this would be hourly)

    return () => clearInterval(interval);
  }, [products]);

  // Reset critical alert dismissal when new critical items appear
  useEffect(() => {
    const currentCriticalItems = products.filter(p => getDaysUntilExpiry(p.expiryDate) <= 1);
    const criticalItemIds = currentCriticalItems.map(p => p.id).sort().join(',');
    
    // Store the previous critical items to detect changes
    const prevCriticalItemIds = localStorage.getItem('prevCriticalItems') || '';
    
    if (criticalItemIds !== prevCriticalItemIds && currentCriticalItems.length > 0) {
      setCriticalAlertDismissed(false);
      localStorage.setItem('prevCriticalItems', criticalItemIds);
    }
  }, [products]);

  const dismissNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  };

  const markActionTaken = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, actionTaken: true } : n)
    );
  };

  const dismissCriticalAlert = () => {
    setCriticalAlertDismissed(true);
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);
  const unreadCount = activeNotifications.filter(n => !n.actionTaken).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'reminder':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const hasCriticalItems = products.some(p => getDaysUntilExpiry(p.expiryDate) <= 1);
  const showCriticalAlert = hasCriticalItems && !criticalAlertDismissed;

  return (
    <>
      {/* Floating notification button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors relative"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications panel */}
      {showNotifications && (
        <div className="fixed bottom-20 right-6 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">System Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {activeNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No active notifications</p>
              </div>
            ) : (
              activeNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${getNotificationStyle(notification.type)} ${
                    notification.actionTaken ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                      
                      <div className="flex space-x-2 mt-2">
                        {!notification.actionTaken && (
                          <button
                            onClick={() => markActionTaken(notification.id)}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                          >
                            Mark as Actioned
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Critical alert overlay for zero-day items */}
      {showCriticalAlert && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                CRITICAL ALERT: Some items have expired or expire today! Immediate action required.
              </span>
            </div>
            <button
              onClick={dismissCriticalAlert}
              className="text-white hover:text-red-200 transition-colors p-1 rounded hover:bg-red-700"
              title="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;