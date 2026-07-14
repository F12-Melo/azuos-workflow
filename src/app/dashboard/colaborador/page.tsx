'use client';

import React from 'react';
import { 
  mockCollaborator, 
  mockCredits, 
  mockFlexBlocks, 
  mockTasks 
} from '@/lib/mockData';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Zap,
  ChevronRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function ColaboradorDashboard() {
  const user = mockCollaborator;
  const credits = mockCredits;

  const formatTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-8 relative">
      {/* Luzes de Fundo (Glow Effect) */}
      <div className="absolute top-[-10%] right-[10%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Título de Boas Vindas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
            Painel Operacional
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100 mt-2">
            Minha Área
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de produtividade assíncrona orientada a entregas.
          </p>
        </div>

        <button className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-102">
          <Plus className="w-4 h-4" />
          Solicitar Bloco Flex
        </button>
      </div>

      {/* Bento Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Bloco 1: Saldo de Crédito (Premium Glassmorphism Card) */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between md:col-span-2 relative group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo de Flexibilidade</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <h3 className="text-5xl font-black text-slate-100">{credits.balanceHours.toFixed(1)}h</h3>
              <span className="text-xs text-slate-500 font-medium">disponíveis / 8.0h</span>
            </div>
            {/* Barra de progresso premium */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-6 border border-slate-900">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(credits.balanceHours / 8) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-4">
            <span>Reset automático: Segunda-feira às 08:00</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              Semana Ativa <Zap className="w-3 h-3 fill-emerald-400" />
            </span>
          </div>
        </div>

        {/* Bloco 2: Segurança LGPD e NR-01 Checklist */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Azuos Privacy Guard</span>
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Sem captura de tela
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Sem webcam ativa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Dados criptografados
              </li>
            </ul>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-850 pt-4 flex items-center gap-1.5 mt-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Conformidade LGPD ativa
          </p>
        </div>

        {/* Bloco 3: Dica de Ergonomia / Burnout (NR-01) */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saúde & Bem Estar</span>
              <HeartPulse className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              "Lembre-se de agendar pausas de desconexão curtas após 2 horas de foco contínuo."
            </p>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit mt-4">
            NR-01 Recomenda
          </span>
        </div>

        {/* Bloco 4: Agenda Semanal (Tamanho grande, 3 colunas de largura no grid) */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Cronograma de Atividades</h3>
              <p className="text-xs text-slate-500">Prazos de entregas e blocos de flexibilidade</p>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">
              Julho, 2026
            </span>
          </div>

          <div className="space-y-3">
            {mockFlexBlocks.map((block) => (
              <div 
                key={block.id}
                className="p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    block.category === 'Consulta Médica' 
                      ? 'bg-rose-500/10 text-rose-400' 
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-200">{block.category}</h4>
                      {block.certificatePath && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/10">
                          <FileText className="w-2.5 h-2.5" />
                          Atestado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 uppercase font-semibold mt-0.5">
                      {formatDate(block.startTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-300 font-bold font-mono">
                      {formatTimeRange(block.startTime, block.endTime)}
                    </p>
                    <p className="text-[10px] text-slate-500">Horário Local</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    block.status === 'Aprovado' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                  }`}>
                    {block.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 5: Metas da Semana (Throughput) */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Minhas Metas</h3>
            <div className="space-y-4">
              {mockTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-3 group">
                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold text-slate-300 leading-tight ${
                      task.status === 'Concluída' ? 'line-through text-slate-500' : ''
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-500">Prazo: {task.dueDate}</p>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    task.status === 'Concluída' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : task.status === 'Em Andamento'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-850 pt-4 mt-6">
            <a href="#tarefas" className="text-[10px] font-bold text-emerald-400 flex items-center justify-between group hover:text-emerald-300">
              Ver Histórico Completo
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
