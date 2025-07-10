export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  expiryDate: string;
  manufacturingDate: string;
  price: number;
  quantity: number;
  location: string;
  supplier: string;
  batchNumber: string;
  description: string;
}

export interface TagInfo {
  color: 'red' | 'yellow' | 'green';
  percentage: number;
  label: string;
}

export interface ActionRecommendation {
  type: 'donate' | 'transfer' | 'discount' | 'priority_sale';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  estimatedSavings?: number;
}