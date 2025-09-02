// apps/web/src/components/EvaluatorFormModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { X } from 'lucide-react';

const EvaluatorFormModal = ({ evaluator, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    idInstituicao: '',
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(evaluator);

  useEffect(() => {
    // Carrega a lista de instituições para o dropdown
    const fetchInstituicoes = async () => {
      try {
        const response = await api.get('/admin/instituicoes');
        setInstituicoes(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar instituições', error);
        setErrors(prev => ({ ...prev, form: 'Não foi possível carregar as instituições.' }));
      }
    };

    fetchInstituicoes();

    // Se estiver a editar, preenche o formulário com os dados do avaliador
    if (isEditing) {
      setFormData({
        nome: evaluator.nome,
        cpf: evaluator.cpf,
        email: evaluator.email,
        idInstituicao: evaluator.idInstituicao,
        senha: '', // Senha fica em branco por segurança
      });
    }
  }, [evaluator, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa o erro do campo ao ser modificado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório.';
    if (!formData.idInstituicao) newErrors.instituicao = 'Instituição é obrigatória.';

    // A senha só é obrigatória ao criar um novo avaliador
    if (!isEditing && !formData.senha) {
      newErrors.senha = 'Senha é obrigatória.';
    }
    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    // Remove o campo de senha se estiver vazio (para não atualizar a senha sem querer)
    const dataToSend = { ...formData };
    if (isEditing && !dataToSend.senha) {
      delete dataToSend.senha;
    }

    try {
      if (isEditing) {
        // Rota de atualização
        await api.put(`/admin/evaluators/${evaluator.id}`, dataToSend);
      } else {
        // Rota de criação
        await api.post('/admin/evaluators', dataToSend);
      }
      onSave(); // Chama a função onSave para fechar o modal e recarregar a lista
    } catch (error) {
      console.error('Erro ao salvar avaliador:', error);
      setErrors({ form: 'Ocorreu um erro. Verifique os dados e tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay do modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Conteúdo do modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{isEditing ? 'Editar Avaliador' : 'Adicionar Novo Avaliador'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Nome Completo */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo *</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF *</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Instituição */}
          <div>
            <label htmlFor="idInstituicao" className="block text-sm font-medium text-gray-700">Instituição *</label>
            <select name="idInstituicao" value={formData.idInstituicao} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.instituicao ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Selecione uma instituição</option>
              {instituicoes.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.nome} ({inst.sigla})</option>
              ))}
            </select>
            {errors.instituicao && <p className="text-red-500 text-xs mt-1">{errors.instituicao}</p>}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha {isEditing ? '(Opcional)' : '*'}</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleInputChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.senha ? 'border-red-500' : 'border-gray-300'}`} placeholder={isEditing ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}/>
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha}</p>}
          </div>
          
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
        </form>

        <div className="flex justify-end items-center p-4 border-t gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400">
            {isLoading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorFormModal;