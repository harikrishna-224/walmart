import React from 'react';
import { FileText, Download, Calendar, Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Product } from '../types/Product';
import { calculateRemainingLifePercentage, getTagInfo, formatDate, getDaysUntilExpiry } from '../utils/dateUtils';

interface PDFGeneratorProps {
  products: Product[];
  selectedTag: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ products, selectedTag }) => {
  const generatePDF = () => {
    // Filter products based on selected tag
    const filteredProducts = selectedTag === 'all' ? products : products.filter(product => {
      const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
      const tagInfo = getTagInfo(remainingLife);
      return tagInfo.color === selectedTag;
    });

    // Create PDF content
    const pdfContent = generatePDFContent(filteredProducts, selectedTag);
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `walmart-inventory-report-${selectedTag}-${new Date().toISOString().split('T')[0]}.html`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    // Show success message
    setTimeout(() => {
      alert(`✅ PDF Report Downloaded Successfully!\n\nFile: walmart-inventory-report-${selectedTag}-${new Date().toISOString().split('T')[0]}.html\n\nYou can open this file in any browser and print it as PDF using Ctrl+P or Cmd+P.`);
    }, 500);
  };

  const generatePDFContent = (products: Product[], tag: string) => {
    const currentDate = new Date().toLocaleDateString();
    const tagLabel = tag === 'all' ? 'All Products' : `${tag.charAt(0).toUpperCase() + tag.slice(1)} Tagged Products`;
    
    const getTagStats = () => {
      const stats = { red: 0, yellow: 0, green: 0 };
      products.forEach(product => {
        const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
        const tagInfo = getTagInfo(remainingLife);
        stats[tagInfo.color]++;
      });
      return stats;
    };

    const stats = getTagStats();
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Walmart Warehouse Inventory Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #0071ce;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0071ce;
            margin-bottom: 10px;
        }
        .report-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .report-info {
            color: #666;
            font-size: 14px;
        }
        .summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #0071ce;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 15px;
        }
        .summary-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        .summary-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .red { color: #dc3545; }
        .yellow { color: #ffc107; }
        .green { color: #28a745; }
        .blue { color: #0071ce; }
        
        .products-section {
            margin-top: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #0071ce;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 12px;
        }
        .product-table th {
            background: #0071ce;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
        }
        .product-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e0e0e0;
            vertical-align: top;
        }
        .product-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .tag-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .tag-red {
            background: #fee;
            color: #dc3545;
            border: 1px solid #dc3545;
        }
        .tag-yellow {
            background: #fff8e1;
            color: #f57c00;
            border: 1px solid #f57c00;
        }
        .tag-green {
            background: #e8f5e8;
            color: #28a745;
            border: 1px solid #28a745;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .download-info {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .download-info h3 {
            color: #1976d2;
            margin: 0 0 10px 0;
        }
        .download-info p {
            color: #1565c0;
            margin: 5px 0;
            font-size: 14px;
        }
        @media print {
            body { margin: 0; }
            .download-info { display: none; }
        }
    </style>
</head>
<body>
    <div class="download-info">
        <h3>📄 How to Save as PDF</h3>
        <p><strong>Windows:</strong> Press Ctrl + P, then select "Save as PDF"</p>
        <p><strong>Mac:</strong> Press Cmd + P, then select "Save as PDF"</p>
        <p><strong>Mobile:</strong> Use your browser's print option and select PDF</p>
    </div>

    <div class="header">
        <div class="logo">🏪 WALMART WAREHOUSE MANAGEMENT</div>
        <div class="report-title">Inventory Expiry Report - ${tagLabel}</div>
        <div class="report-info">Generated on ${currentDate} | Store Manager Dashboard</div>
    </div>

    <div class="summary">
        <h3 style="margin-top: 0; color: #0071ce;">Executive Summary</h3>
        <p>This report provides a comprehensive overview of inventory items based on their expiry status and remaining shelf life.</p>
        
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number blue">${products.length}</div>
                <div class="summary-label">Total Products</div>
            </div>
            <div class="summary-item">
                <div class="summary-number green">$${totalValue.toLocaleString()}</div>
                <div class="summary-label">Total Value</div>
            </div>
            <div class="summary-item">
                <div class="summary-number red">${stats.red}</div>
                <div class="summary-label">Critical Items</div>
            </div>
            <div class="summary-item">
                <div class="summary-number yellow">${stats.yellow}</div>
                <div class="summary-label">Warning Items</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px;">
            <h4 style="margin: 0 0 10px 0; color: #0071ce;">Key Insights</h4>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Critical items require immediate action to prevent losses</li>
                <li>Warning items should be monitored and action planned</li>
                <li>Good items are in stable condition</li>
                <li>Total inventory value: $${totalValue.toLocaleString()}</li>
            </ul>
        </div>
    </div>

    <div class="products-section">
        <div class="section-title">Product Inventory Details</div>
        
        <table class="product-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Value</th>
                    <th>Expiry Date</th>
                    <th>Days Left</th>
                    <th>Life %</th>
                    <th>Status</th>
                    <th>Batch #</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => {
                  const remainingLife = calculateRemainingLifePercentage(product.manufacturingDate, product.expiryDate);
                  const tagInfo = getTagInfo(remainingLife);
                  const daysLeft = getDaysUntilExpiry(product.expiryDate);
                  const totalValue = product.price * product.quantity;
                  
                  return `
                    <tr>
                        <td><strong>${product.name}</strong></td>
                        <td>${product.category}</td>
                        <td>${product.location}</td>
                        <td>${product.quantity}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>$${totalValue.toFixed(2)}</td>
                        <td>${formatDate(product.expiryDate)}</td>
                        <td>${daysLeft}</td>
                        <td>${Math.round(remainingLife)}%</td>
                        <td><span class="tag-badge tag-${tagInfo.color}">${tagInfo.label}</span></td>
                        <td>${product.batchNumber}</td>
                    </tr>
                  `;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p><strong>Walmart Warehouse Management System</strong></p>
        <p>This report is confidential and intended for authorized personnel only.</p>
        <p>For questions or concerns, contact the IT Support Team.</p>
        <p>Report generated on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'red':
        return <AlertTriangle className="w-4 h-4" />;
      case 'yellow':
        return <Clock className="w-4 h-4" />;
      case 'green':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case 'all':
        return 'All Products';
      case 'red':
        return 'Critical Items';
      case 'yellow':
        return 'Warning Items';
      case 'green':
        return 'Good Items';
      default:
        return 'Products';
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium"
    >
      <FileText className="w-4 h-4" />
      <span>Download PDF Report</span>
      <Download className="w-4 h-4" />
    </button>
  );
};

export default PDFGenerator;