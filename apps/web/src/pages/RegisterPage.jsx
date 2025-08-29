import {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import taipiriImg from "../assets/taipiriLogin.png";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'USER'
  });

  const [instituicoes, setInstituicoes] = useState([]);
  const [selectedInstituicao, setSelectedInstituicao] = useState('');
  const [showNewInstituicaoForm, setShowNewInstituicaoForm] = useState(false);
  const [newInstituicao, setNewInstituicao] = useState({
    nome: '',
    sigla: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  //o use effect é executado quando a página é montada e faz a chamada para a api para listar as instituições no formulário
  useEffect(() => {
    const loadInstituicoes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/instituicoes');
        setInstituicoes(response.data || []); //preenche as instituições no formulário
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
        setErrors(prev => ({ ...prev, instituicao: 'Não foi possível carregar as instituições' }));
      }
    };
    loadInstituicoes();
  }, []);


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


  //essa função captura as mudanças no select da instituição
  const handleInstituicaoChange = (event) => {
    const value = event.target.value; //
    if (value === 'new') {
      setShowNewInstituicaoForm(true); // mostra o formulário de cadastro de uma nova instituição
      setSelectedInstituicao('');
      setErrors(prev => ({ ...prev, instituicao: '' }));
    } else {
      setShowNewInstituicaoForm(false);
      setSelectedInstituicao(value);
      setErrors(prev => ({ ...prev, instituicao: '' }));
    }
  };

  //essa captura os campos do cadastro de uma nova instituição
  const handleNewInstituicaoChange = (event) => {
    const { name, value } = event.target;
    setNewInstituicao(prev => ({ ...prev, [name]: value }));
    if (name === 'nome' && errors.nomeInstituicao) {
      setErrors(prev => ({ ...prev, nomeInstituicao: '' }));
    }
    if (name === 'sigla' && errors.siglaInstituicao) {
      setErrors(prev => ({ ...prev, siglaInstituicao: '' }));
    }
  };

  const onClose = () => {
    navigate('/');
  };


  //função de validação dos campos do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

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

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    if (!selectedInstituicao && !showNewInstituicaoForm) {
      newErrors.instituicao = 'Selecione uma instituição ou cadastre uma nova';
    }

    if (showNewInstituicaoForm) {
      if (!newInstituicao.nome.trim()) {
        newErrors.nomeInstituicao = 'Nome da instituição é obrigatório';
      }
      if (!newInstituicao.sigla.trim()) {
        newErrors.siglaInstituicao = 'Sigla da instituição é obrigatória';
      }
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

    setIsLoading(true);


    try {
      let idInstituicao;

      // Se for uma nova instituição, cria primeiro
      if (showNewInstituicaoForm) {
        const instituicaoResponse = await axios.post('http://localhost:3000/api/instituicoes', newInstituicao);
        idInstituicao = instituicaoResponse.data?.id;
        if (!idInstituicao) {
          throw new Error('Resposta inválida da criação da instituição');
        }
      }else{
        idInstituicao = Number(selectedInstituicao);
      }

      // Cria usuário
      const userData = {
        ...formData,
        idInstituicao: idInstituicao,
        cpf: formData.cpf.replace(/\D/g, '') //remove os caracteres especiais
      };

      delete userData.confirmarSenha; //deleta o campo de confirmação de senha, essa validação é feita apenas no frontend

      const userResponse = await axios.post('http://localhost:3000/api/users', userData); //faz o post para a api e cria o usuário

      if (userResponse.status >= 200 && userResponse.status < 300) {
        resetForm();
        alert('Usuário cadastrado com sucesso!');
        navigate('/');
      } else {
        throw new Error('Erro ao criar usuário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErrors({ submit: 'Erro ao realizar cadastro. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: 'USER'
    });
    setSelectedInstituicao('');
    setShowNewInstituicaoForm(false);
    setNewInstituicao({ nome: '', sigla: '' });
    setErrors({});
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };
  

  
    return (
      <>
        <section className="bg-brand-background-light w-full h-full relative">
          <div className="container mx-auto w-screen px-6 lg:pt-12 flex flex-col md:flex-row items-center justify-between gap-12">

            <div className="relative w-2/3 h-screen overflow-hidden">
              {/* mancha azul 1 */}
              <div className="absolute top-10 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              {/* mancha azul 2 */}
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
              
              <div className="absolute bottom-20 right-10 w-92 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>

              <img src={taipiriImg}/>
            </div>

            <div className="px-12 py-8 rounded-3xl shadow-2xl shadow-slate-400">
              <div>
                <h3 className="text-lg md:text-4xl font-bold leading-tight text-brand-blue">Cadastre-se</h3>
                <p className="mt-2 mb-6 text-base text-brand-text-secondary max-w-xl md:mx-0 mx-auto">
                  Já possui conta? <span className="underline">Login</span>
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.nome && (
                    <span className="text-sm text-red-600">{errors.nome}</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                    CPF *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    className={`w-full px-3 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cpf ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength="14"
                  />
                  {errors.cpf && (
                    <span className="text-sm text-red-600">{errors.cpf}</span>
                  )}
                </div>
                
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      id="confirmarSenha"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirme sua senha"
                    />
                    {errors.confirmarSenha && (
                      <span className="text-sm text-red-600">{errors.confirmarSenha}</span>
                    )}
                  </div>
                </div>
                  
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Tipo de Usuário
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">Usuário</option>
                    <option value="AVALIADOR">Avaliador</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                  
                <div className="space-y-2">
                  <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">
                    Instituição *
                  </label>
                  <select
                    id="instituicao"
                    value={selectedInstituicao}
                    onChange={handleInstituicaoChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.instituicao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma instituição</option>
                    {instituicoes.map(inst => (
                      <option key={inst.id} value={inst.id}>
                        {inst.nome} ({inst.sigla})
                      </option>
                    ))}
                    <option value="new">+ Cadastrar nova instituição</option>
                  </select>
                  {errors.instituicao && (
                    <span className="text-sm text-red-600">{errors.instituicao}</span>
                  )}
                </div>
                
                {showNewInstituicaoForm && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Instituição</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="nomeInstituicao" className="block text-sm font-medium text-gray-700">
                          Nome da Instituição *
                        </label>
                        <input
                          type="text"
                          id="nomeInstituicao"
                          name="nome"
                          value={newInstituicao.nome}
                          onChange={handleNewInstituicaoChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.nomeInstituicao ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nome completo da instituição"
                        />
                        {errors.nomeInstituicao && (
                          <span className="text-sm text-red-600">{errors.nomeInstituicao}</span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="siglaInstituicao" className="block text-sm font-medium text-gray-700">
                          Sigla *
                        </label>
                        <input
                          type="text"
                          id="siglaInstituicao"
                          name="sigla"
                          value={newInstituicao.sigla}
                          onChange={handleNewInstituicaoChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.siglaInstituicao ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ex: USP, UNIFESP"
                          maxLength="10"
                        />
                        {errors.siglaInstituicao && (
                          <span className="text-sm text-red-600">{errors.siglaInstituicao}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {errors.submit}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </>
    )
}


const RegisterPageWrapper = () => {
  return (
      <RegisterPage/>
  )
}

export default RegisterPageWrapper;