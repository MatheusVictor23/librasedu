// src/pages/AdminDashboardPage.jsx
import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { Users, Newspaper } from 'lucide-react';

// Componente de Card de Estatísticas
const StatCard = ({ title, value, icon, percentage, isPositive }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 text-brand-blue mr-4">
        {icon}
      </div>
      <div>
        <p className="text-brand-text-secondary text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-brand-text-primary">{value}</h3>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Visão Geral</h2>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total de Utilizadores" value="1,257" icon={<Users size={24} />} />
        <StatCard title="Sinais Propostos" value="452" icon={<Newspaper size={24} />} />
        {/* Adicione mais cards conforme necessário */}
      </div>

      {/* Tabela de Utilizadores Recentes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Utilizadores Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          {/* A tabela de utilizadores virá aqui no futuro */}
          <p className="p-6 text-brand-text-secondary">A tabela de gestão de utilizadores será implementada aqui.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;