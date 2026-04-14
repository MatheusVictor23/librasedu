// apps/web/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Users, UsersRound, FileText, CheckCircle } from 'lucide-react';
// 1. Importar o Doughnut para o gráfico de pizza
import { Line, Doughnut } from 'react-chartjs-2'; 
// 2. Importar o ArcElement necessário para o gráfico de pizza
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// 3. Registar o novo elemento
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${bgColor} ${textColor} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-brand-text-secondary text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-brand-text-primary">{value}</h3>
      </div>
    </div>
  </div>
);

const RecentActivityChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => new Date(d.date).toLocaleDateString('pt-BR')),
        datasets: [{
            label: 'Novas Propostas de Sinais',
            data: chartData.map(d => d.count),
            borderColor: '#31487A',
            backgroundColor: 'rgba(49, 72, 122, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    };
    const options = { responsive: true, plugins: { legend: { display: false } } };
    return <Line options={options} data={data} />;
};

// 4. Novo componente para o gráfico de pizza
const UsersByRoleChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.role),
        datasets: [{
            data: chartData.map(d => d._count.role),
            backgroundColor: [
                '#31487A', // Azul (USER)
                '#34D399', // Verde (AVALIADOR)
                '#F87171', // Vermelho (ADMIN)
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2,
        }],
    };
    const options = { responsive: true, plugins: { legend: { position: 'right' } } };
    return <Doughnut options={options} data={data} />;
};


const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [proposalsChartData, setProposalsChartData] = useState([]);
  const [usersByRoleData, setUsersByRoleData] = useState([]); // 5. Novo estado para os dados do gráfico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 6. Adicionar a nova chamada à API
        const [statsRes, usersRes, chartRes, rolesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/recent-users'),
          api.get('/admin/proposals-by-day'),
          api.get('/admin/users-by-role') // <-- Nova chamada
        ]);
        setStats(statsRes.data);
        setRecentUsers(usersRes.data);
        setProposalsChartData(chartRes.data);
        setUsersByRoleData(rolesRes.data); // 7. Guardar os dados no novo estado
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Visão Geral</h2>
      
      {loading && <p>A carregar dados...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total de Utilizadores" value={stats.totalUsers} icon={<Users size={24} />} bgColor="bg-blue-100" textColor="text-blue-600"/>
            <StatCard title="Total de Avaliadores" value={stats.totalEvaluators} icon={<UsersRound size={24} />} bgColor="bg-green-100" textColor="text-green-600"/>
            <StatCard title="Sinais Propostos" value={stats.totalProposals} icon={<FileText size={24} />} bgColor="bg-yellow-100" textColor="text-yellow-600"/>
            <StatCard title="Sinais Oficiais" value={stats.totalOfficialSignals} icon={<CheckCircle size={24} />} bgColor="bg-indigo-100" textColor="text-indigo-600"/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Novas Propostas (Últimos 7 dias)</h3>
                {proposalsChartData.length > 0 ? <RecentActivityChart chartData={proposalsChartData} /> : <p className="text-center text-gray-500 pt-16">Sem dados para exibir.</p>}
            </div>
            
            {/* 8. Substituir o placeholder pelo novo gráfico */}
            <div className="bg-white rounded-lg shadow p-6">
                 <h3 className="text-lg font-semibold mb-4">Distribuição de Perfis</h3>
                 {usersByRoleData.length > 0 ? <UsersByRoleChart chartData={usersByRoleData} /> : <p className="text-center text-gray-500 pt-16">Sem dados para exibir.</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Utilizadores Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Registo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : (user.role === 'AVALIADOR' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800')}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;