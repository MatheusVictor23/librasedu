// src/components/StatCard.jsx

import React from 'react';
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatCard = ({ type, value, label, trend }) => {
  const getIcon = () => {
    switch (type) {
      case 'submitted':
        return <TrendingUp size={20} className="text-gray-500" />;
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      case 'pending':
        return <Clock size={20} className="text-orange-500" />;
      default:
        return <TrendingUp size={20} className="text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'submitted':
        return 'bg-gray-50';
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      case 'pending':
        return 'bg-orange-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`${getBackgroundColor()} rounded-lg p-6 text-center`}>
      <div className="flex justify-center mb-3">
        {getIcon()}
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      
      <div className="text-sm text-gray-600">
        {label}
      </div>
      
      {trend && (
        <div className="text-xs text-gray-500 mt-2">
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;