// src/components/StatCard.jsx

import React from 'react';
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatCard = ({ type, value, label, trend }) => {
  const getIcon = () => {
    switch (type) {
      case 'submitted':
        return <TrendingUp size={24} className="text-gray-600" />;
      case 'approved':
        return <CheckCircle size={24} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={24} className="text-red-600" />;
      case 'pending':
        return <Clock size={24} className="text-orange-600" />;
      default:
        return <TrendingUp size={24} className="text-gray-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'submitted':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          border: 'border-gray-200'
        };
      case 'approved':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
          iconBg: 'bg-green-100',
          border: 'border-green-200'
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-rose-100',
          iconBg: 'bg-red-100',
          border: 'border-red-200'
        };
      case 'pending':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-amber-100',
          iconBg: 'bg-orange-100',
          border: 'border-orange-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconBg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.bg} rounded-xl p-6 border ${styles.border} hover:shadow-lg transition-all duration-300 hover:scale-105 transform`}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`${styles.iconBg} p-3 rounded-lg`}>
          {getIcon()}
        </div>
        
        <div className="text-4xl font-bold text-gray-900">
          {value}
        </div>
        
        <div className="text-sm font-medium text-gray-700">
          {label}
        </div>
        
        {trend && (
          <div className="text-xs text-gray-500 mt-2 font-medium">
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;