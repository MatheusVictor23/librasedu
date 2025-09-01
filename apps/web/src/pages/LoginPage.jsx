// src/pages/LoginPage.jsx

import {useState} from 'react';
import { Link } from 'react-router-dom';
import taipiriImg from "../assets/taipiriLogin.png";
import googleLogo from "../assets/google.svg";
import appleLogo from "../assets/apple.svg";
import { useAuth } from "../context/AuthContext" 

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const { loginAction } = useAuth();


  const [errors, setErrors] = useState({}); //Um objeto que armazena os erros da página, o formato do erro utilizado é error.nome: error.message
  const [isLoading, setIsLoading] = useState(false); //utilizado para a requisição para dar um tempo a requisição da api

  //essa função captura as mudanças nos campos do formulário
  const handleInputChange = (event) => {

    const { name, value } = event.target; //captura o nome e o valor do campo

    setFormData(prev => ({
      ...prev, //mantém valores anteriores
      [name]: value //adiciona o novo valor ao objeto formData
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev, //mantém outros erros
        [name]: '' // remove o erro referente ao campo
      }));
    }

  };








  //função de validação dos campos do formulário


  const validateForm = () => {

    const newErrors = {};

    if (!formData.email.trim()) {

      newErrors.email = 'Email é obrigatório';

    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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





  //essa função cuida do envio do formulário


  const handleSubmit = async (e) => {

    e.preventDefault(); //previne o comportamento padrão de recarregar a página ao enviar o formulário


    


    if (!validateForm()) {
      return;
    }

    const {email, senha } = formData;

    setIsLoading(true);

    try {

      await loginAction(email, senha); 

      resetForm();

    } catch (err) {
      setErrors(prev => ({
        ...prev,
        email: err.message || 'Falha ao fazer login.'
      }));
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

      <>
        <section className="bg-brand-background-light w-full min-h-screen flex flex-col md:flex-row">

          {/* lado esquerdo - imagens e manchas */}
          <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden hidden md:block">

            {/* mancha azul 1 */}
            <div className="absolute top-10 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            {/* mancha azul 2 */}
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>

            {/* mancha azul 3 */}
            <div className="absolute top-5 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>

            {/* mancha azul 4 */}
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-35"></div>

            {/* imagem sobre o blur */}
            <img src={taipiriImg} alt="Portal Tapiri" className="relative z-50 left-20" />

          </div>

          {/* lado direito - formulário */}
          <div className="w-full md:w-1/2 flex items-center justify-start p-8 md:p-12">

            <div className="w-full max-w-[80%] bg-white px-8 md:px-12 py-8 md:ml-2 rounded-3xl shadow-2xl shadow-slate-400">

              <div>

                <h3 className="text-lg md:text-4xl font-bold leading-tight text-brand-blue">Login</h3>

                <p className="mt-2 mb-6 text-base text-brand-text-secondary max-w-xl md:mx-0 mx-auto">
                  Entre com o seu email e senha para acessar sua conta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-2">

                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}

                    className={`w-full px-3 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}

                    placeholder="seu@email.com"

                  />

                  {errors.email && (

                    <span className="text-sm text-red-600">{errors.email}</span>

                  )}

                </div>

                <div className="space-y-2 flex flex-col">

                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha *
                  </label>

                  <input

                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.senha ? 'border-red-500' : 'border-gray-300'

                    }`}

                    placeholder="Mínimo 6 caracteres"

                  />

                  {errors.senha && (
                    <span className="text-sm text-red-600">{errors.senha}</span>
                  )}

                  <span className="mt-1 mb-6 max-w-xl md:mx-0 mx-auto text-brand-blue font-medium text-sm self-end">
                    Esqueceu sua senha?
                  </span>
                </div>

                {errors.submit && (

                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {errors.submit}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}

                  </button>
                </div>

              </form>

              <div className="mt-4 flex flex-row items-center justify-center">

                <hr className="w-1/4"/>

                <span className="text-sm text-brand-text-secondary max-w-xl px-6">
                  Ou faça login com
                </span>

                <hr className="w-1/4"/>

              </div>

              <div className="flex justify-center gap-6 py-4">

                <button className="px-4 py-3 w-1/2 h-2/3 border border-solid border-gray-400 rounded-full flex flex-row justify-center items-center gap-1">

                  <img src={googleLogo} width={"24px"}/>Google

                </button>

                <button className="px-4 py-3 w-1/2 h-2/3 border border-solid border-gray-400 rounded-full flex flex-row justify-center items-center gap-1">

                  <img src={appleLogo} width={"24px"}/>Apple

                </button>
              </div>





              <div className="flex justify-center">

                <p className="mb-6 text-sm text-brand-text-secondary max-w-xl md:mx-0 mx-auto">
                  Não tem uma conta? <span className="text-brand-blue underline"><Link to={"/register"}>Cadastre-se agora</Link></span>
                </p>

              </div>

            </div>
          </div>
        </section>


      </>
    )
}

export default LoginPage;