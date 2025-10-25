import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import taipiriImg from "../assets/taipiriLogin.png";
import { UserCircle, ArrowLeft } from 'lucide-react';

const AnimatedBackgroundBlobs = () => (
  <>
    <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
    <div className="absolute top-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob [animation-delay:-5s]"></div>
    <div className="absolute bottom-10 left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob [animation-delay:-2s]"></div>
  </>
);

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
    const cleanedCPF = formData.cpf.replace(/\D/g, '');
    if (!cleanedCPF) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cleanedCPF.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    } else if (!/^[0-9]{11}$/.test(cleanedCPF)) {
      newErrors.cpf = 'CPF inválido';
    } else if (!validateCPFDigits(cleanedCPF)) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
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

  const validateCPFDigits = (cpf) => {
    let sum = 0;
    let remainder;
    if (cpf === '00000000000') return false;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
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
    setFormData({ nome: '', cpf: '', email: '', senha: '', confirmarSenha: '', role: 'USER' });
    setAvatarFile(null);
    setAvatarPreview('');
    setErrors({});
  };

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3) formatted = cleaned.substring(0, 3) + '.' + cleaned.substring(3);
    if (cleaned.length > 6) formatted = formatted.substring(0, 7) + '.' + cleaned.substring(6);
    if (cleaned.length > 9) formatted = formatted.substring(0, 11) + '-' + cleaned.substring(9);
    return formatted.substring(0, 14);
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };
  
  return (
    <section className="relative bg-brand-background-light w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
      <AnimatedBackgroundBlobs />
      
      <Link to="/" className="absolute top-6 left-6 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-md">
        <ArrowLeft className="text-brand-blue" />
      </Link>
      
      <div className="relative z-10 w-full md:w-1/2 h-64 md:h-screen hidden md:flex items-center justify-center">
        <img src={taipiriImg} alt="Portal Tapiri" className="relative z-10 max-w-[70%] h-auto" />
      </div>

      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm px-6 sm:px-8 md:px-10 py-8 rounded-3xl shadow-2xl shadow-slate-400">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-brand-blue">Registre-se</h3>
            <p className="mt-2 mb-4 sm:mb-6 text-sm sm:text-base text-brand-text-secondary">
              Já possui conta? <Link to="/login" className="underline text-brand-blue font-semibold">Login</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {avatarPreview ? (<img src={avatarPreview} alt="Preview" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200" />) : (<UserCircle size={80} className="text-gray-300 sm:size-24" />)}
              </label>
              <input id="avatar-upload" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <label htmlFor="avatar-upload" className="text-xs sm:text-sm font-medium text-brand-blue hover:underline cursor-pointer">
                Escolher foto de perfil (opcional)
              </label>
            </div>
            
            <div>
              <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700">Nome Completo *</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm text-sm ${errors.nome ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite o seu nome completo" required />
              {errors.nome && <span className="text-xs text-red-600">{errors.nome}</span>}
            </div>
            
            <div>
              <label htmlFor="cpf" className="block text-xs sm:text-sm font-medium text-gray-700">CPF *</label>
              <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleCPFChange} className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm text-sm ${errors.cpf ? 'border-red-500' : 'border-gray-300'}`} placeholder="000.000.000-00" maxLength="14" required />
              {errors.cpf && <span className="text-xs text-red-600">{errors.cpf}</span>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="seu@email.com" required />
              {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="senha" className="block text-xs sm:text-sm font-medium text-gray-700">Senha *</label>
                <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm text-sm ${errors.senha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Mínimo 6 caracteres" required />
                {errors.senha && <span className="text-xs text-red-600">{errors.senha}</span>}
              </div>
              
              <div>
                <label htmlFor="confirmarSenha" className="block text-xs sm:text-sm font-medium text-gray-700">Confirmar Senha *</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-lg shadow-sm text-sm ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirme a sua senha" required />
                {errors.confirmarSenha && <span className="text-xs text-red-600">{errors.confirmarSenha}</span>}
              </div>
            </div>
            
            {errors.submit && (<div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs sm:text-sm">{errors.submit}</div>)}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Registrar'}</button>
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