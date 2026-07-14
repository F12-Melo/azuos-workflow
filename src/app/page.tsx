'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Coffee, 
  ArrowRight, 
  User, 
  Shield, 
  Lock,
  HeartPulse,
  Clock,
  Sparkles,
  ChevronDown,
  Eye,
  EyeOff,
  Sliders,
  CheckCircle,
  FileCheck
} from 'lucide-react';

export default function LandoLandingPage() {
  const router = useRouter();
  
  // Estados para simulações interativas na página
  const [simulatedCredits, setSimulatedCredits] = useState(8.0);
  const [privacyMode, setPrivacyMode] = useState<'traditional' | 'azuos'>('azuos');
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const handleLogin = (role: 'colaborador' | 'gestor') => {
    if (role === 'gestor') {
      router.push('/dashboard/gestor');
    } else {
      router.push('/dashboard/colaborador');
    }
  };

  const handleSimulatePause = (hours: number) => {
    setSimulatedCredits(prev => Math.max(0, parseFloat((prev - hours).toFixed(1))));
  };

  const features = [
    {
      title: 'Sistema de Créditos',
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Dinâmico com Grade e Brilhos Neon */}
      <div className="absolute inset-0 bg-grid-glow opacity-60 z-0 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px] animate-glow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-teal-500/10 rounded-full blur-[150px] animate-glow pointer-events-none" />

      {/* 1. Header Premium */}
      <header className="px-8 py-6 max-w-7xl mx-auto flex items-center justify-between border-b border-slate-900/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              AZUOS
            </span>
            <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
              Workflow Manager
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Produtos</a>
          <a href="#demo" className="hover:text-emerald-400 transition-colors">Simulador</a>
          <a href="#acesso" className="hover:text-emerald-400 transition-colors">Acessar Painel</a>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="#acesso" 
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-102"
          >
            Acessar Dashboard
          </a>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 px-8 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge Flutuante */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Gestão por resultados e autonomia flexível</span>
        </div>

        {/* Headline Titânica Estilo Lando Norris */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none max-w-5xl select-none">
          <span className="text-slate-100">Produtividade Sem</span>
          <span className="block text-stroke text-stroke-hover transition-all duration-300">
            Vigilância Invasiva
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-lg max-w-2xl mt-8 leading-relaxed">
          Substitua o monitoramento invasivo por um ecossistema semanal baseado em créditos de flexibilidade de tempo. Segurança jurídica (LGPD e NR-01) com autonomia total do colaborador.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto">
          <a 
            href="#acesso" 
            className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/10"
          >
            Entrar na Plataforma
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:text-slate-200 transition-all duration-300 flex items-center justify-center"
          >
            Conhecer os Recursos
          </a>
        </div>
      </section>

      {/* 3. Seção de Demonstração de Recursos (Produtos / Utilização) */}
      <section id="features" className="relative z-10 px-8 py-20 max-w-7xl mx-auto border-t border-slate-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-400 tracking-widest mb-2">Nosso Diferencial</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-100">
              Pilares do Azuos
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
                        ? 'bg-slate-900/60 border-emerald-500/30' 
                        : 'bg-slate-950 border-slate-900/80 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-200">{feat.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                        {feat.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                        {feat.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulador Interativo ao Lado */}
          <div id="demo" className="bg-slate-900/40 border border-slate-850 p-8 rounded-3xl backdrop-blur-md relative animate-float">
            <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" /> Interativo
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-6">Simulador Azuos em Tempo Real</h3>

            {/* Painel do Simulador de Créditos */}
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo de Horas Restante</p>
                  <h4 className="text-3xl font-extrabold mt-1 text-slate-200">{simulatedCredits.toFixed(1)}h</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSimulatePause(0.5)}
                    className="px-3 py-1.5 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                  >
                    Simular -0.5h
                  </button>
                  <button 
                    onClick={() => handleSimulatePause(2.0)}
                    className="px-3 py-1.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-all"
                  >
                    Simular -2.0h
                  </button>
                </div>
              </div>

              {/* Comparador de Privacidade */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modo de Privacidade</h4>
                  <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-lg">
                    <button 
                      onClick={() => setPrivacyMode('traditional')}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all ${
                        privacyMode === 'traditional' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500'
                      }`}
                    >
                      Invasivo
                    </button>
                    <button 
                      onClick={() => setPrivacyMode('azuos')}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all ${
                        privacyMode === 'azuos' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      Azuos
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  {privacyMode === 'traditional' ? (
                    <div className="space-y-2 text-xs">
                      <p className="text-rose-400 font-bold flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5" /> Monitoramento Tradicional
                      </p>
                      <div className="bg-slate-900 p-3 rounded-lg font-mono text-[10px] text-slate-500 space-y-1">
                        <p className="text-rose-300">[LOG] 10:14 - Captura de tela tirada (janela ativa: Youtube)</p>
                        <p className="text-rose-300">[LOG] 10:15 - Detecção de ausência do teclado e webcam ligada</p>
                        <p className="text-rose-400">[LOG] 10:16 - Alerta: Gabriela inativa por mais de 5 minutos</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Visão Azuos (Privacy by Design)
                      </p>
                      <div className="bg-slate-900 p-3 rounded-lg font-mono text-[10px] text-slate-400 space-y-1">
                        <p className="text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>10:00 - 12:00: Bloco de Flexibilização ocupado (Consulta Médica)</span>
                        </p>
                        <p className="text-slate-500">Nenhum dado pessoal, log de teclas ou imagem capturada.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Acesso ao Dashboard (Seção de Conversão) */}
      <section id="acesso" className="relative z-10 px-8 py-24 max-w-7xl mx-auto border-t border-slate-900/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase text-emerald-400 tracking-widest mb-2">Simulação Rápida</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-100">
            Entre na Plataforma
          </h2>
          <p className="text-slate-400 text-sm mt-4">
            Escolha o perfil do MVP para acessar as visões completas da aplicação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Colaborador */}
          <div 
            onClick={() => handleLogin('colaborador')}
            className="p-8 rounded-3xl border border-slate-850 bg-slate-900/20 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer hover:scale-103 relative"
          >
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 text-slate-400">
              <ArrowRight className="w-4 h-4 group-hover:rotate-[-45deg] transition-all" />
            </div>

            <div className="p-4 bg-slate-900/80 text-emerald-400 w-fit rounded-2xl mb-6 group-hover:bg-emerald-500/10 transition-colors">
              <User className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
              Portal do Colaborador
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Veja a agenda semanal de prazos, controle seu saldo de 8 horas e envie atestados médicos com privacidade garantida.
            </p>
            <div className="flex items-center gap-2 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-emerald-500/60" />
              <span>Simular Gabriela Silva</span>
            </div>
          </div>

          {/* Card Gestor */}
          <div 
            onClick={() => handleLogin('gestor')}
            className="p-8 rounded-3xl border border-slate-850 bg-slate-900/20 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer hover:scale-103 relative"
          >
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-800 group-hover:bg-purple-500 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 text-slate-400">
              <ArrowRight className="w-4 h-4 group-hover:rotate-[-45deg] transition-all" />
            </div>

            <div className="p-4 bg-slate-900/80 text-purple-400 w-fit rounded-2xl mb-6 group-hover:bg-purple-500/10 transition-colors">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
              Portal do Gestor
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Monitore o throughput semanal da equipe por gráficos, gerencie créditos de folgas e controle a elegibilidade jurídica de cargos.
            </p>
            <div className="flex items-center gap-2 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-purple-500/60" />
              <span>Simular Renato Mota</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 text-center text-xs text-slate-600 border-t border-slate-900/60 relative z-10 max-w-7xl mx-auto">
        <p>Azuos Workflow Manager &copy; 2026. Desenvolvido sob a filosofia de Privacy by Design.</p>
        <p className="text-[10px] text-slate-700 mt-2">Conformidade garantida com LGPD e diretrizes de riscos psicossociais da NR-01.</p>
      </footer>
    </div>
  );
}
