export const calculateRemainingLifePercentage = (manufacturingDate: string, expiryDate: string): number => {
  const now = new Date();
  const mfgDate = new Date(manufacturingDate);
  const expDate = new Date(expiryDate);
  
  const totalLifespan = expDate.getTime() - mfgDate.getTime();
  const timeElapsed = now.getTime() - mfgDate.getTime();
  const timeRemaining = expDate.getTime() - now.getTime();
  
  if (timeRemaining <= 0) return 0;
  if (timeElapsed <= 0) return 100;
  
  return Math.max(0, Math.min(100, (timeRemaining / totalLifespan) * 100));
};

export const getTagInfo = (percentage: number): { color: 'red' | 'yellow' | 'green'; label: string } => {
  if (percentage <= 20) {
    return { color: 'red', label: 'Critical' };
  } else if (percentage <= 49) {
    return { color: 'yellow', label: 'Warning' };
  } else {
    return { color: 'green', label: 'Good' };
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const now = new Date();
  const expDate = new Date(expiryDate);
  const diffTime = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Prevent products from going to zero days by ensuring minimum 1 day
export const getAdjustedDaysUntilExpiry = (expiryDate: string): number => {
  const daysLeft = getDaysUntilExpiry(expiryDate);
  return Math.max(1, daysLeft); // Ensure minimum 1 day
};