'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Coffee, 
  ArrowRight, 
  User, 
  Shield, 
  Lock,
  HeartPulse,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  CheckCircle,
  FileCheck,
  Loader2,
  LockKeyhole,
  AlertCircle
} from 'lucide-react';

export default function AzuosLandingPage() {
  const router = useRouter();
  const { signIn, profile, loading } = useAuth();
  
  // Estados para simulações interativas da landing page Azuos
  const [simulatedCredits, setSimulatedCredits] = useState(8.0);
  const [privacyMode, setPrivacyMode] = useState<'traditional' | 'azuos'>('azuos');
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  
  // Estado para formulário de login real
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirecionamento automático se estiver logado
  useEffect(() => {
    if (!loading && profile) {
      if (profile.is_hr) {
        router.push('/dashboard/rh');
      } else if (profile.role === 'manager') {
        router.push('/dashboard/gestor');
      } else {
        router.push('/dashboard/colaborador');
      }
    }
  }, [profile, loading, router]);

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Por favor, insira o e-mail e a senha.');
      return;
    }
    setSubmitting(true);
    setLoginError('');
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError(error);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    } finally {
      setSubmitting(false);
    }
  };

  // Preenchimento de teste rápido (Preenche os inputs, mas obriga a fazer login real)
  const handleQuickFill = (role: 'colaborador' | 'gestor' | 'rh') => {
    setLoginError('');
    if (role === 'colaborador') {
      setEmail('colaborador@azuos.com.br');
    } else if (role === 'gestor') {
      setEmail('gestor@azuos.com.br');
    } else if (role === 'rh') {
      setEmail('rh@azuos.com.br');
    }
  };

  const handleSimulatePause = (hours: number) => {
    setSimulatedCredits(prev => Math.max(0, parseFloat((prev - hours).toFixed(1))));
  };

  const features = [
    {
      title: 'Sistema de Créditos de Flexibilidade',
      description: 'Cada colaborador elegível recebe 8 horas de flexibilização semanais. Solicite pausas sem precisar expor os detalhes do seu compromisso.',
      icon: Clock,
      badge: 'Regra RN01'
    },
    {
      title: 'Privacy by Design',
      description: 'Conformidade rígida com a LGPD. Sem capturas de tela, webcams ou keyloggers. O gestor vê apenas intervalos bloqueados genéricos.',
      icon: Lock,
      badge: 'Regra RN02'
    },
    {
      title: 'Prevenção ao Overwork',
      description: 'Direito à desconexão de acordo com a NR-01. O sistema dispara alertas caso o limite de horas de foco sem pausas seja excedido.',
      icon: HeartPulse,
      badge: 'Regra RNF02'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 font-sans relative overflow-x-hidden selection:bg-[#aaffd8] selection:text-slate-900">
      
      {/* Background Gradients com a paleta Azuos 
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#6CBED9]/5 rounded-full blur-[150px] pointer-events-none animate-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-[#30728d]/5 rounded-full blur-[150px] pointer-events-none animate-glow" />
        */}
      {/* 1. Header */}
      <header className="px-8 py-6 max-w-7xl mx-auto flex items-center justify-between border-b border-slate-200/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          {/* Top logo sem borda, simples e transparente */}
          <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="Azuos Logo"
              className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-[var(--azuos-blue)]">
              AZUOS
            </span>
            <span className="block text-[8px] text-[var(--azuos-blue)] uppercase tracking-widest font-bold mt-0.5">
              Workflow Manager
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500">
          <a href="#features" className="hover:text-[var(--azuos-blue)] transition-colors">Diferenciais</a>
          <a href="#demo" className="hover:text-[var(--azuos-blue)] transition-colors">Simulador</a>
          <a href="#acesso" className="hover:text-[var(--azuos-blue)] transition-colors">Entrar</a>
        </nav>

        <div>
          <a
            href="#acesso"
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-br from-[var(--azuos-blue)] to-[var(--azuos-green)] text-white hover:opacity-95 transition-all duration-300 shadow-md shadow-[var(--azuos-blue)]/10 hover:scale-102"
          >
            Acessar Painel
          </a>
        </div>
      </header>

      {/* 2. Hero Section com identidade Azuos */}
        {/* 2. Hero Section com identidade Azuos */}
        {/* Full-bleed logo hero: branco puro que ocupa 100vh */}
        <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden relative">
          <img
            src="/logo_landing_page.png"
            alt="Azuos Logo"
            className="w-full h-full object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {/* gradiente de transição para o resto da página (visível ao rolar) */}
          <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(248,250,248,1) 100%)' }}
          />
        </div>

        <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge Flutuante */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-500 mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-[var(--azuos-blue)]" />
          <span>Gestão por resultados e autonomia flexível</span>
        </div>

          {/* Espaço reservado acima transformado em full-bleed hero */}

        {/* Headline Titânica Estilo Norris em Tema Claro */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none max-w-5xl select-none text-[var(--azuos-blue)]">
          <span>PRODUTIVIDADE SEM</span>
          <span
            className="block text-transparent transition-all duration-300"
            style={{ WebkitTextStroke: `2px var(--azuos-blue)` }}
          >
            VIGILÂNCIA INVASIVA
          </span>
        </h1>

        <p className="text-slate-600 text-sm md:text-base max-w-2xl mt-8 leading-relaxed">
          Substitua o monitoramento ostensivo por um ecossistema semanal baseado em créditos de tempo. Segurança jurídica completa alinhada à <strong className="text-[var(--azuos-blue)]">LGPD</strong> e à <strong className="text-[var(--azuos-blue)]">NR-01</strong> com autonomia para o colaborador.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto">
          <a
            href="#acesso"
            className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-gradient-to-br from-[var(--azuos-blue)] to-[var(--azuos-green)] text-white hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-[var(--azuos-blue)]/10"
          >
            Acessar Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest border border-slate-200 hover:bg-white text-slate-600 hover:text-slate-800 transition-all duration-300 flex items-center justify-center"
          >
            Conhecer os Recursos
          </a>
        </div>
      </section>

      {/* 3. Diferenciais & Simulador Interativo */}
      <section id="features" className="relative z-10 px-8 py-20 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--azuos-blue)] tracking-widest mb-2">Pilares do Azuos</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-850">
              Autonomia & Privacidade
            </h2>
            
            <div className="space-y-4 mt-8">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                const isSelected = selectedFeature === index;
                
                return (
                  <div 
                    key={feat.title}
                    onClick={() => setSelectedFeature(index)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-[var(--azuos-blue)]/30 shadow-md' 
                        : 'bg-white/60 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-[var(--azuos-blue)]/10 text-[var(--azuos-blue)]' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{feat.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {feat.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        {feat.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulador Interativo */}
          <div id="demo" className="bg-white border border-slate-200 p-8 rounded-3xl relative shadow-md">
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[var(--azuos-blue)] to-[var(--azuos-green)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" /> Interativo
            </div>

            <h3 className="text-lg font-bold text-slate-805 mb-6">Simulador Azuos em Tempo Real</h3>

            <div className="space-y-6">
              <div className="bg-[#F8FAF8] p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo de Horas Restante</p>
                  <h4 className="text-3xl font-extrabold mt-1 text-slate-800">{simulatedCredits.toFixed(1)}h</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSimulatePause(0.5)}
                    className="px-3 py-1.5 text-[10px] font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all cursor-pointer"
                  >
                    Pausa -0.5h
                  </button>
                  <button 
                    onClick={() => handleSimulatePause(2.0)}
                    className="px-3 py-1.5 text-[10px] font-semibold bg-[var(--azuos-blue)]/10 text-[var(--azuos-blue)] border border-[var(--azuos-blue)]/20 hover:bg-[var(--azuos-blue)]/20 rounded-lg transition-all cursor-pointer"
                  >
                    Ausência -2.0h
                  </button>
                </div>
              </div>

              {/* Comparador de Privacidade */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modo de Monitoramento</h4>
                  <div className="flex bg-[#F8FAF8] border border-slate-200 p-1 rounded-lg">
                    <button 
                      onClick={() => setPrivacyMode('traditional')}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                          privacyMode === 'traditional' ? 'bg-[var(--azuos-blue)]/10 text-[var(--azuos-blue)]' : 'text-slate-400'
                        }`}
                    >
                        Invasivo
                    </button>
                    <button 
                      onClick={() => setPrivacyMode('azuos')}
                        className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                          privacyMode === 'azuos' ? 'bg-[var(--azuos-green)]/10 text-[var(--azuos-green)]' : 'text-slate-400'
                        }`}
                    >
                      Azuos
                    </button>
                  </div>
                </div>

                <div className="bg-[#F8FAF8] p-5 rounded-2xl border border-slate-200">
                  {privacyMode === 'traditional' ? (
                    <div className="space-y-2 text-xs">
                      <p className="text-[var(--azuos-blue)] font-bold flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5" /> Monitoramento Tradicional (Espionagem)
                      </p>
                      <div className="bg-white border border-slate-200 p-3 rounded-lg font-mono text-[10px] text-[var(--azuos-blue)] space-y-1">
                        <p>[LOG] 10:14 - Webcam ativada (Monitoramento de Olhos)</p>
                        <p>[LOG] 10:15 - Captura de tela registrada (Janela ativa: Outlook)</p>
                        <p>[LOG] 10:16 - Alerta: Gabriela inativa por mais de 3 minutos</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <p className="text-[var(--azuos-green)] font-bold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[var(--azuos-green)]" /> Visão Azuos (Privacy by Design)
                      </p>
                      <div className="bg-white border border-slate-200 p-3 rounded-lg font-mono text-[10px] text-slate-650 space-y-1">
                        <p className="text-[var(--azuos-green)] flex items-center gap-1.5 font-semibold">
                          <CheckCircle className="w-3 h-3 text-[var(--azuos-green)]" />
                          <span>10:00 - 12:00: Bloco Reservado (Consulta Médica)</span>
                        </p>
                        <p className="text-slate-400">Sem rastreamento de webcam, telas ou teclas.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Login Real com Supabase Auth */}
      <section id="acesso" className="relative z-10 px-8 py-24 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase text-[var(--azuos-blue)] tracking-widest mb-2">Portal Corporativo</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-850">
            Acessar o Painel
          </h2>
          <p className="text-slate-500 text-sm mt-4">
            Faça login com as credenciais da sua conta Supabase Auth ou utilize as opções rápidas para carregar os e-mails de teste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
          
          {/* Contas de Avaliação */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-md">
            <div>
              <h3 className="text-xl font-extrabold text-[var(--azuos-blue)] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[var(--azuos-blue)]" /> Contas de Testes
              </h3>
              <p className="text-xs text-[#486575] mt-2">
                Clique em um dos perfis abaixo para preencher o e-mail de teste correspondente:
              </p>
            </div>

            <div className="space-y-4">
              {/* Colaborador */}
              <button 
                onClick={() => handleQuickFill('colaborador')}
                className="w-full text-left p-4 bg-[#F8FAF8] border border-slate-200 hover:border-[var(--azuos-blue)] rounded-2xl flex items-center justify-between group transition-all cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-[var(--azuos-blue)]">Portal do Colaborador</h4>
                  <p className="text-[10px] text-slate-500 mt-1">colaborador@azuos.com.br</p>
                </div>
                <div className="p-2 bg-[var(--azuos-blue)]/10 text-[var(--azuos-blue)] rounded-xl">
                  <User className="w-4 h-4" />
                </div>
              </button>

              {/* Gestor */}
              <button 
                onClick={() => handleQuickFill('gestor')}
                className="w-full text-left p-4 bg-[#F8FAF8] border border-slate-200 hover:border-[var(--azuos-blue)] rounded-2xl flex items-center justify-between group transition-all cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-805 group-hover:text-[var(--azuos-blue)]">Portal do Gestor</h4>
                  <p className="text-[10px] text-slate-500 mt-1">gestor@azuos.com.br</p>
                </div>
                <div className="p-2 bg-[var(--azuos-blue)]/10 text-[var(--azuos-blue)] rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
              </button>

              {/* RH */}
              <button 
                onClick={() => handleQuickFill('rh')}
                className="w-full text-left p-4 bg-[#F8FAF8] border border-slate-200 hover:border-[var(--azuos-blue)] rounded-2xl flex items-center justify-between group transition-all cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-805 group-hover:text-[var(--azuos-blue)]">Portal do RH</h4>
                  <p className="text-[10px] text-slate-500 mt-1">rh@azuos.com.br</p>
                </div>
                <div className="p-2 bg-[var(--azuos-green)]/10 text-[var(--azuos-green)] rounded-xl border border-[var(--azuos-green)]/20">
                  <FileCheck className="w-4 h-4" />
                </div>
              </button>
            </div>

                <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#d9e7ef] text-[10px] text-[#486575] leading-relaxed">
              Autenticação segura: use as credenciais reais do Supabase e mantenha as senhas protegidas.
            </div>
          </div>

          {/* Form Real Supabase Auth */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col justify-center shadow-md text-slate-700">
            <h3 className="text-xl font-extrabold text-slate-805 mb-6 flex items-center gap-2">
              <LockKeyhole className="w-5 h-5 text-[var(--azuos-blue)]" /> Credenciais Supabase Auth
            </h3>

            <form onSubmit={handleRealLogin} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="text-slate-550 font-bold uppercase tracking-wider text-[10px]">E-mail Corporativo</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@azuos.com.br"
                  className="w-full bg-[#F8FAF8] border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-[var(--azuos-blue)] transition-all text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-550 font-bold uppercase tracking-wider text-[10px]">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAF8] border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-[var(--azuos-blue)] transition-all text-xs"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-br from-[var(--azuos-blue)] to-[var(--azuos-green)] text-white font-bold uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-1 text-[11px] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verificando Credenciais...
                  </>
                ) : (
                  <>
                    Entrar com Supabase Auth <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-16 text-center text-xs text-slate-400 border-t border-slate-200 relative z-10 max-w-7xl mx-auto">
        <p>Azuos Workflow Manager &copy; 2026. Desenvolvido sob a filosofia de Privacy by Design.</p>
        <p className="text-[10px] text-slate-400 mt-2">Conformidade garantida com as diretrizes de privacidade LGPD e saúde ocupacional NR-01.</p>
      </footer>
    </div>
  );
}
