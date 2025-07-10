import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface TagFilterProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  productCounts: {
    all: number;
    red: number;
    yellow: number;
    green: number;
  };
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onTagChange, productCounts }) => {
  const tags = [
    { id: 'all', label: 'All Products', color: 'bg-gray-100 text-gray-800', count: productCounts.all, icon: null },
    { id: 'red', label: 'Critical', color: 'bg-red-100 text-red-800', count: productCounts.red, icon: AlertTriangle },
    { id: 'yellow', label: 'Warning', color: 'bg-yellow-100 text-yellow-800', count: productCounts.yellow, icon: Clock },
    { id: 'green', label: 'Good', color: 'bg-green-100 text-green-800', count: productCounts.green, icon: CheckCircle }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {tags.map((tag) => {
        const Icon = tag.icon;
        return (
          <button
            key={tag.id}
            onClick={() => onTagChange(tag.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedTag === tag.id
                ? `${tag.color} ring-2 ring-blue-500 ring-opacity-50 shadow-md`
                : `${tag.color} hover:shadow-md`
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tag.label}</span>
            <span className="bg-white bg-opacity-70 px-2 py-0.5 rounded-full text-xs">
              {tag.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;