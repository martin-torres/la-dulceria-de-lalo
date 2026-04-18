import React from 'react';
import { useTranslations } from '../../../hooks/useTranslations';

interface TabBarProps {
  categories: Array<{ code: string; displayName: string }>;
  selectedCategory: string;
  onSelectCategory: (code: string) => void;
  primaryColor?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  primaryColor = '#f59e0b',
}) => {
  const { getCategoryName } = useTranslations();
  
  // Gracefully handle empty categories - return nothing instead of crashing
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-6 px-6">
      {categories.map((category) => (
        <button
          key={category.code}
          onClick={() => onSelectCategory(category.code)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
            selectedCategory === category.code
              ? 'text-white shadow-md'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          style={
            selectedCategory === category.code
              ? { backgroundColor: primaryColor }
              : undefined
          }
        >
          {getCategoryName(category.code, category.displayName)}
        </button>
      ))}
    </div>
  );
};
