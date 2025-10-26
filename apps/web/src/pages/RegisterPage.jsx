// src/pages/RegisterPage.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import taipiriImg from "../assets/auth.svg";
import { UserCircle, ArrowLeft, CheckCircle, XCircle, X } from 'lucide-react';

const AnimatedBackgroundBlobs = () => (
  <>
    <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
    <div className="absolute top-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob [animation-delay:-5s]"></div>
    <div className="absolute bottom-10 left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob [animation-delay:-2s]"></div>
  </>
);

// Componente de Notificação Toast
const Toast = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl border-2 ${
        isSuccess 
          ? 'bg-green-50 border-green-500' 
          : 'bg-red-50 border-red-500'
      }`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold mb-1 ${
            isSuccess ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSuccess ? 'Sucesso!' : 'Erro no cadastro'}
          </h3>
          <p className={`text-sm ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            isSuccess 
              ? 'hover:bg-green-100 text-green-600' 
              : 'hover:bg-red-100 text-red-600'
          }`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Modal de Sucesso
const SuccessModal = ({ onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-brand-text-primary mb-3">
            Cadastro realizado com sucesso!
          </h2>
          
          <p className="text-brand-text-secondary mb-8">
            Sua conta foi criada. Agora você pode fazer login e começar a explorar o Portal Tapiri.
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Fechar
            </button>
            <button
              onClick={onNavigate}
              className="flex-1 px-4 py-2.5 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-blue-dark transition-all shadow-md hover:shadow-lg"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [toast, setToast] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
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
        setShowSuccessModal(true);
      } else {
        throw new Error('Erro ao criar utilizador');
      }
    } catch (error) {
      console.error('Erro ao registar:', error);
      const errorMsg = error.response?.data?.details || 'Erro ao realizar o registo. Tente novamente.';
      showToast('error', errorMsg);
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
    <section className="relative bg-brand-background-light w-full min-h-screen flex items-center justify-center p-4 sm:p-6 py-8 md:py-6 overflow-hidden">
      <AnimatedBackgroundBlobs />
      
      {/* Toast de Notificação */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/login');
          }}
          onNavigate={() => {
            setShowSuccessModal(false);
            navigate('/login');
          }}
        />
      )}
      
      <Link to="/" className="absolute top-6 left-6 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors shadow-md">
        <ArrowLeft className="text-brand-blue" />
      </Link>
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center">

        <div className="relative z-10 w-full md:w-1/2 hidden md:flex items-center justify-center">
          <img src={taipiriImg} alt="Portal Tapiri" className="relative z-10 w-full max-w-md h-auto" />
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
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200" />
                  ) : (
                    <UserCircle size={80} className="text-gray-300 sm:size-24" />
                  )}
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
              
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg animate-shake">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button type="button" onClick={onClose} className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registrando...
                    </span>
                  ) : (
                    'Registrar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}

const RegisterPageWrapper = () => {
  return <RegisterPage/>
}

export default RegisterPageWrapper;