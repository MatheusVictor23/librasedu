// apps/web/src/pages/AdminSettingsPage.jsx
import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const AdminSettingsPage = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Definições do Sistema</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-700">Aqui serão configuradas as definições gerais da aplicação.</p>
        {/* Adicione os seus formulários e opções de configuração aqui */}
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;