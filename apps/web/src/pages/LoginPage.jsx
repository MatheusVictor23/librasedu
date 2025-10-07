import { useState } from 'react';
import { Link } from 'react-router-dom';
import taipiriImg from "../assets/taipiriLogin.png";
import googleLogo from "../assets/google.svg";
import appleLogo from "../assets/apple.svg";
import { useAuth } from "../context/AuthContext";

const AnimatedBackgroundBlobs = () => (
  <>
    <div className="absolute top-10 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-spin-1"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob-move-1"></div>
    <div className="absolute top-5 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob-spin-2 delay-1000"></div>
    <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob-move-2 delay-2000"></div>
  </>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const { loginAction } = useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email deve ser válido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { email, senha } = formData;

    setIsLoading(true);
    setErrors({}); // Limpa erros anteriores antes de tentar o login

    try {
      await loginAction(email, senha);
      resetForm();
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Falha ao fazer login. Verifique suas credenciais.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      senha: '',
    });
    setErrors({});
  };

  return (
    <section className="bg-brand-background-light w-full min-h-screen flex flex-col md:flex-row">
      {/* Lado Esquerdo - Imagem e Animação */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden hidden md:flex items-center justify-center">
        <AnimatedBackgroundBlobs />
        <img src={taipiriImg} alt="Portal Tapiri" className="relative z-10 max-w-[80%] h-auto" /> {/* Aumentado para 80% */}
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="w-full max-w-lg bg-white px-6 sm:px-8 md:px-10 py-8 rounded-3xl shadow-2xl shadow-slate-400"> {/* max-w-lg e padding ajustados */}
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-brand-blue">Login</h3>
            <p className="mt-2 mb-4 sm:mb-6 text-sm sm:text-base text-brand-text-secondary">
              Entre com o seu email e senha para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <span className="text-xs text-red-600">{errors.email}</span>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <label htmlFor="senha" className="block text-xs sm:text-sm font-medium text-gray-700">
                Senha *
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.senha ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.senha && (
                <span className="text-xs text-red-600">{errors.senha}</span>
              )}
              <span className="mt-1 text-xs sm:text-sm text-brand-blue font-medium self-end">
                Esqueceu sua senha?
              </span>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs sm:text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="submit"
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-row items-center justify-center">
            <hr className="flex-grow border-t border-gray-300"/>
            <span className="text-xs sm:text-sm text-brand-text-secondary px-4">
              Ou faça login com
            </span>
            <hr className="flex-grow border-t border-gray-300"/>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 py-4">
            <button className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-solid border-gray-400 rounded-lg flex flex-row justify-center items-center gap-2 text-xs sm:text-sm">
              <img src={googleLogo} width="20px" alt="Google Logo"/>Google
            </button>
            <button className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-solid border-gray-400 rounded-lg flex flex-row justify-center items-center gap-2 text-xs sm:text-sm">
              <img src={appleLogo} width="20px" alt="Apple Logo"/>Apple
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <p className="text-xs sm:text-sm text-brand-text-secondary">
              Não tem uma conta? <Link to="/register" className="text-brand-blue underline">Cadastre-se agora</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
