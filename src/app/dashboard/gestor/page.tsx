'use client';

import React from 'react';
import { 
  mockManager, 
  mockTeamCredits, 
  mockFlexBlocks 
} from '@/lib/mockData';
import { 
  Users, 
  Clock, 
  ShieldAlert, 
  Check, 
  X, 
  FileText, 
  Sliders,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function GestorDashboard() {
  const manager = mockManager;
  const pendingModerations = mockFlexBlocks.filter(b => b.status === 'Pendente');

  return (
    <div className="space-y-8 relative">
      {/* Luz de Fundo (Glow Effect) */}
      <div className="absolute top-[-10%] right-[10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Título de Boas Vindas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
            Painel Executivo
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100 mt-2">
            Gestão da Equipe
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisão de rendimento semanal e moderação de créditos flexíveis.
          </p>
        </div>
      </div>

      {/* Bento Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Card 1: Membros Ativos */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tamanho da Equipe</span>
            <Users className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-100">{mockTeamCredits.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Colaboradores ativos</p>
          </div>
        </div>

        {/* Card 2: Média de Créditos Restantes */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Média de Saldos</span>
            <Clock className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-100">
              {(mockTeamCredits.reduce((acc, curr) => acc + curr.balanceHours, 0) / mockTeamCredits.length).toFixed(1)}h
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Disponíveis / colaborador</p>
          </div>
        </div>

        {/* Card 3: Risco de Burnout / Performance */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ações Requeridas</span>
            <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-100">
              {mockTeamCredits.filter(c => c.performance < 70).length}
            </h3>
            <p className="text-[11px] text-rose-400/80 mt-1 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Abaixo de 70% da meta
            </p>
          </div>
        </div>

        {/* Card 4: Status do Módulo RNF04 */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Performance API</span>
            <Activity className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-100">97ms</h3>
            <p className="text-[11px] text-cyan-400 mt-1 font-semibold">Tempo de Resposta Ideal (RNF04)</p>
          </div>
        </div>

        {/* Card 5: Gráfico de Produtividade (Tamanho 3 colunas) */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Produtividade Consolidada</h3>
              <p className="text-xs text-slate-500">Mapeamento de throughput semanal da equipe</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-950 border border-slate-850 px-3 py-1 rounded-lg">
              Atualizado há 5 min
            </span>
          </div>

          {/* Mock visual do gráfico com Bento Design */}
          <div className="h-60 flex flex-col justify-between border-l border-b border-slate-800/60 pl-4 pb-2 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px] z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                Integração do Recharts no Dia 2
              </span>
            </div>

            <div className="flex justify-around items-end h-full w-full gap-8 pt-6">
              <div className="w-16 bg-gradient-to-t from-purple-500/20 to-purple-500/30 h-[45%] rounded-t-xl relative flex justify-center group">
                <span className="text-[9px] text-slate-400 absolute -top-5">Iniciadas (12)</span>
              </div>
              <div className="w-16 bg-gradient-to-t from-blue-500/20 to-blue-500/30 h-[60%] rounded-t-xl relative flex justify-center">
                <span className="text-[9px] text-slate-400 absolute -top-5">Em Curso (18)</span>
              </div>
              <div className="w-16 bg-gradient-to-t from-emerald-500/20 to-emerald-500/30 h-[85%] rounded-t-xl relative flex justify-center">
                <span className="text-[9px] text-slate-400 absolute -top-5">Entregues (24)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Central de Aprovações Pendentes */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Aprovações</h3>
            <p className="text-xs text-slate-500">Blocos de atestados pendentes</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-48">
            {pendingModerations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <TrendingUp className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                Sem solicitações pendentes.
              </div>
            ) : (
              pendingModerations.map((block) => (
                <div key={block.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{block.userName}</h4>
                    <a href="#" className="text-[9px] text-emerald-400 flex items-center gap-1 hover:underline mt-0.5">
                      <FileText className="w-3 h-3" /> Ver Atestado
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition-all">
                      <Check className="w-3 h-3" />
                    </button>
                    <button className="p-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded hover:bg-rose-500/20 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 7: Painel de Controle de Créditos (Tabela Equipe - Largura total) */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md md:col-span-3 lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Painel de Controle de Créditos</h3>
              <p className="text-xs text-slate-500">Supervisão de saldo e metas para renovação automática (RN01 / RN05)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-4">Colaborador</th>
                  <th className="pb-4">Crédito Disponível</th>
                  <th className="pb-4">Status de Elegibilidade</th>
                  <th className="pb-4">Rendimento Semanal (Min. 70%)</th>
                  <th className="pb-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamCredits.map((colab) => (
                  <tr key={colab.id} className="border-b border-slate-850/60 hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 font-semibold text-slate-200">{colab.name}</td>
                    <td className="py-4 font-mono font-bold text-slate-300">{colab.balanceHours.toFixed(1)}h / 8.0h</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        colab.isEligible 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
                      }`}>
                        {colab.isEligible ? 'Elegível' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-200 w-8">{colab.performance}%</span>
                        <div className="w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className={`h-full rounded-full ${
                              colab.performance >= 70 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${colab.performance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <button className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-850 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-all">
                        Ajustar Acesso
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
