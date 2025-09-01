// src/pages/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig'; // Importamos a nossa instância configurada do axios
import { Trash2, Edit } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Usamos o 'api' que já tem o intercetor de token
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError('Não foi possível carregar os utilizadores. Você tem permissão de administrador?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Tem a certeza de que quer apagar este utilizador?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        // Remove o utilizador da lista local para atualizar a UI instantaneamente
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        alert('Erro ao apagar o utilizador.');
      }
    }
  };

  if (loading) return <AdminLayout><p>A carregar utilizadores...</p></AdminLayout>;
  if (error) return <AdminLayout><p className="text-red-500">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-brand-text-primary">Gestão de Utilizadores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-brand-blue hover:text-brand-blue-dark mr-4"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;