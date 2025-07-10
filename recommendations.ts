import { Product, ActionRecommendation } from '../types/Product';
import { calculateRemainingLifePercentage } from './dateUtils';

export const getActionRecommendations = (product: Product): ActionRecommendation[] => {
  const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
  const recommendations: ActionRecommendation[] = [];

  if (remainingLife <= 20) {
    // Critical - Red tag recommendations
    recommendations.push({
      type: 'donate',
      title: 'Donate to Charity',
      description: `Donate ${product.quantity} units to local food banks or charities before expiry. Tax deduction available.`,
      urgency: 'high',
      estimatedSavings: product.price * product.quantity * 0.15
    });

    recommendations.push({
      type: 'discount',
      title: 'Emergency Discount (70% off)',
      description: 'Apply maximum discount to move inventory quickly. Monitor sales velocity.',
      urgency: 'high',
      estimatedSavings: product.price * product.quantity * 0.3
    });

    recommendations.push({
      type: 'priority_sale',
      title: 'Priority Sale Display',
      description: 'Move to front-of-store display with "Manager\'s Special" signage.',
      urgency: 'high'
    });
  } else if (remainingLife <= 49) {
    // Warning - Yellow tag recommendations
    recommendations.push({
      type: 'discount',
      title: 'Dynamic Discount (30-50% off)',
      description: 'Apply moderate discount based on sales velocity. Adjust daily.',
      urgency: 'medium',
      estimatedSavings: product.price * product.quantity * 0.4
    });

    recommendations.push({
      type: 'transfer',
      title: 'Store-to-Store Transfer',
      description: `Transfer ${Math.floor(product.quantity * 0.6)} units to high-velocity stores. Optimize inventory distribution.`,
      urgency: 'medium',
      estimatedSavings: product.price * product.quantity * 0.2
    });
  } else {
    // Good - Green tag recommendations
    recommendations.push({
      type: 'transfer',
      title: 'Inventory Optimization',
      description: 'Monitor sales patterns. Consider strategic redistribution if needed.',
      urgency: 'low'
    });
  }

  return recommendations;
};

export const calculatePotentialSavings = (products: Product[]): number => {
  return products.reduce((total, product) => {
    const recommendations = getActionRecommendations(product);
    const maxSavings = Math.max(...recommendations.map(r => r.estimatedSavings || 0));
    return total + maxSavings;
  }, 0);
};