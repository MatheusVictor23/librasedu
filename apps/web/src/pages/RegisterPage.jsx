import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import taipiriImg from "../assets/taipiriLogin.png";
import { UserCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'USER'
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview('');
    }
  };

  const onClose = () => {
    navigate('/login');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const submissionData = new FormData();
    submissionData.append('nome', formData.nome);
    submissionData.append('cpf', formData.cpf.replace(/\D/g, ''));
    submissionData.append('email', formData.email);
    submissionData.append('senha', formData.senha);
    submissionData.append('role', formData.role);

    if (avatarFile) {
      submissionData.append('avatar', avatarFile);
    }
    
    try {
      const userResponse = await axios.post('http://localhost:3000/api/users', submissionData);

      if (userResponse.status >= 200 && userResponse.status < 300) {
        resetForm();
        alert('Utilizador registado com sucesso! Faça login para continuar.');
        navigate('/login');
      } else {
        throw new Error('Erro ao criar utilizador');
      }
    } catch (error) {
      console.error('Erro ao registar:', error);
      const errorMsg = error.response?.data?.details || 'Erro ao realizar o registo. Tente novamente.';
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '', cpf: '', email: '', senha: '', confirmarSenha: '', role: 'USER'
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setErrors({});
  };

  const formatCPF = (value) => {
    return value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };
  
  return (
    <section className="bg-brand-background-light w-full min-h-screen flex flex-col md:flex-row">
      {/* Lado Esquerdo - Imagem */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden hidden md:block">
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
        <img src={taipiriImg} alt="Portal Tapiri" className="relative z-50 left-20" />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-lg bg-white px-8 md:px-12 py-8 rounded-3xl shadow-2xl shadow-slate-400">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight text-brand-blue">Registe-se</h3>
            <p className="mt-2 mb-6 text-base text-brand-text-secondary">
              Já possui conta? <Link to="/login" className="underline text-brand-blue font-semibold">Login</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                ) : (
                  <UserCircle size={96} className="text-gray-300" />
                )}
              </label>
              <input id="avatar-upload" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <label htmlFor="avatar-upload" className="text-sm font-medium text-brand-blue hover:underline cursor-pointer">
                Escolher foto de perfil (opcional)
              </label>
            </div>
            
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo *</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite o seu nome completo" required />
              {errors.nome && <span className="text-sm text-red-600">{errors.nome}</span>}
            </div>
            
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF *</label>
              <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleCPFChange} className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`} placeholder="000.000.000-00" required />
              {errors.cpf && <span className="text-sm text-red-600">{errors.cpf}</span>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="seu@email.com" required />
              {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha *</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleInputChange} className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm ${errors.senha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Mínimo 6 caracteres" required />
                {errors.senha && <span className="text-sm text-red-600">{errors.senha}</span>}
              </div>
              
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha *</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleInputChange} className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirme a sua senha" required />
                {errors.confirmarSenha && <span className="text-sm text-red-600">{errors.confirmarSenha}</span>}
              </div>
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50" disabled={isLoading}>
                {isLoading ? 'A Registar...' : 'Registar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const RegisterPageWrapper = () => {
  return (
      <RegisterPage/>
  )
}

export default RegisterPageWrapper;