// src/components/TabNavigation.jsx

import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange, variant = 'default' }) => {
  const getTabStyles = (tab, isActive) => {
    if (variant === 'pills') {
      return isActive
        ? 'bg-brand-blue text-white shadow-lg'
        : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200';
    }
    
    return isActive
      ? 'border-b-2 border-brand-blue text-brand-blue'
      : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <div className={`flex ${variant === 'pills' ? 'space-x-2' : 'border-b border-gray-200'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 font-medium text-sm transition-colors
            ${getTabStyles(tab, activeTab === tab.id)}
            ${variant === 'pills' ? 'rounded-full' : 'pb-3'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
