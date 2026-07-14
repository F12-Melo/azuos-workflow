'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { categoryLabels, statusLabels } from '@/lib/mockData';
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
  ArrowUpRight,
  Loader2,
  Lock,
  Unlock,
  PlusCircle,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';

interface TeamMemberData {
  id: number;
  name: string;
  email: string;
  flex_eligible: boolean;
  role: string;
  is_hr: boolean;
  performance: number;
  hours_available: number;
}

interface ModerationBlockData {
  id: number;
  user_id: number;
  user_name: string;
  starts_at: string;
  ends_at: string;
  category: 'break' | 'medical' | 'personal' | 'study';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  proof_url?: string;
}

export default function GestorDashboard() {
  const { profile } = useAuth();
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [pendingBlocks, setPendingBlocks] = useState<ModerationBlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  
  // Chamados
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedColabId, setSelectedColabId] = useState<number | null>(null);
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketType, setTicketType] = useState('performance_alignment');
  const [sendingTicket, setSendingTicket] = useState(false);

  useEffect(() => {
    if (!profile) return;
    fetchGestorData();
  }, [profile]);

  const fetchGestorData = async () => {
    setLoading(true);
    try {
      // 1. Membros subordinados reais do Supabase
      const { data: teamData, error: teamErr } = await supabase
        .from('users')
        .select('*, credit_balances(hours_available)')
        .eq('manager_id', profile!.id);

      if (teamErr) throw teamErr;

      if (teamData) {
        // Calcular performance dinâmica baseada em tarefas
        const membersList = await Promise.all(teamData.map(async (m: any) => {
          const { data: taskData } = await supabase
            .from('tasks')
            .select('task_status')
            .eq('user_id', m.id);

          const total = taskData?.length || 0;
          const completed = taskData?.filter((t: any) => t.task_status === 'completed').length || 0;
          const perf = total === 0 ? 100 : Math.round((completed / total) * 100);

          return {
            id: m.id,
            name: m.name,
            email: m.email,
            flex_eligible: m.flex_eligible,
            role: m.role,
            is_hr: m.is_hr,
            performance: perf,
            hours_available: m.credit_balances?.[0]?.hours_available ?? 8.0
          };
        }));
        setTeamMembers(membersList);

        // 2. Buscar solicitações de pausas pendentes da equipe subordinada
        const teamIds = teamData.map(t => t.id);
        if (teamIds.length > 0) {
          const { data: pendData } = await supabase
            .from('flex_blocks')
            .select('*, users(name), flex_block_proofs(proof_url)')
            .in('user_id', teamIds)
            .eq('status', 'pending');

          if (pendData) {
            const formatted: ModerationBlockData[] = pendData.map((b: any) => ({
              id: b.id,
              user_id: b.user_id,
              user_name: b.users?.name || 'Colaborador',
              starts_at: b.starts_at,
              ends_at: b.ends_at,
              category: b.category,
              status: b.status,
              proof_url: b.flex_block_proofs?.[0]?.proof_url || b.flex_block_proofs?.proof_url
            }));
            setPendingBlocks(formatted);
          } else {
            setPendingBlocks([]);
          }
        } else {
          setPendingBlocks([]);
        }
      }
    } catch (e) {
      console.error('Erro ao buscar dados do Gestor:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateBlock = async (block: ModerationBlockData, action: 'approved' | 'rejected') => {
    setModeratingId(block.id);
    try {
      // 1. Atualizar status no banco
      const { error } = await supabase
        .from('flex_blocks')
        .update({ status: action, reviewed_by: profile!.id, updated_at: new Date().toISOString() })
        .eq('id', block.id);

      if (error) throw error;

      // 2. Se for rejeitado e não for médico, estorna os créditos retirados do colaborador
      if (action === 'rejected' && block.category !== 'medical') {
        const start = new Date(block.starts_at);
        const end = new Date(block.ends_at);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const { data: balanceData } = await supabase
          .from('credit_balances')
          .select('hours_available')
          .eq('user_id', block.user_id)
          .single();

        if (balanceData) {
          const currentBal = balanceData.hours_available || 0;
          const newBal = Math.min(8.0, currentBal + hours);

          await supabase
            .from('credit_balances')
            .update({ hours_available: newBal })
            .eq('user_id', block.user_id);

          // Registrar transação de crédito
          await supabase.from('credit_transactions').insert({
            user_id: block.user_id,
            week_start: new Date().toISOString().split('T')[0],
            amount: hours,
            reason: `Estorno (Agendamento Recusado pelo Gestor): ${categoryLabels[block.category]}`,
            flex_block_id: block.id,
            created_by: profile!.id
          });
        }
      }
      await fetchGestorData();
    } catch (e) {
      console.error('Erro na moderação:', e);
    } finally {
      setModeratingId(null);
    }
  };

  const handleToggleEligibility = async (member: TeamMemberData) => {
    const nextStatus = !member.flex_eligible;
    try {
      const { error } = await supabase
        .from('users')
        .update({ flex_eligible: nextStatus })
        .eq('id', member.id);
      if (error) throw error;
      await fetchGestorData();
    } catch (e) {
      console.error('Erro ao alternar elegibilidade:', e);
    }
  };

  const handleOpenTicket = (memberId: number) => {
    setSelectedColabId(memberId);
    setIsTicketModalOpen(true);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDescription.trim()) return;

    setSendingTicket(true);
    try {
      const { error } = await supabase.from('tickets').insert({
        opened_by: profile!.id,
        user_id: selectedColabId,
        description: ticketDescription,
        type: ticketType
      });
      if (error) throw error;

      setTicketDescription('');
      setIsTicketModalOpen(false);
      alert('Chamado de alinhamento registrado com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao registrar chamado.');
    } finally {
      setSendingTicket(false);
    }
  };

  const formatTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#F8FAF8]">
        <Loader2 className="w-8 h-8 text-[#30728d] animate-spin" />
        <span className="ml-3 text-xs uppercase tracking-widest text-slate-500">Carregando dados da equipe...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative text-slate-800">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#6CBED9]/25 text-[#30728d] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#30728d]/20">
            Painel Executivo
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-850 mt-2">
            Gestão da Equipe
          </h1>
          <p className="text-xs text-slate-550 mt-1">
            Supervisão de rendimento semanal e moderação de créditos flexíveis.
          </p>
        </div>
      </div>

      {/* Bento Grid Principal (Tema Claro Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Card 1: Membros Ativos */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tamanho da Equipe</span>
            <Users className="w-4.5 h-4.5 text-[#30728d]" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">{teamMembers.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Colaboradores diretos</p>
          </div>
        </div>

        {/* Card 2: Média de Créditos */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Média de Saldos</span>
            <Clock className="w-4.5 h-4.5 text-[#6CBED9]" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">
              {teamMembers.length === 0 
                ? '0.0h' 
                : `${(teamMembers.reduce((acc, curr) => acc + curr.hours_available, 0) / teamMembers.length).toFixed(1)}h`}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Disponíveis / colaborador</p>
          </div>
        </div>

        {/* Card 3: Baixo Desempenho */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alertas de Metas</span>
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">
              {teamMembers.filter(c => c.performance < 70).length}
            </h3>
            <p className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Abaixo de 70% de throughput
            </p>
          </div>
        </div>

        {/* Card 4: Latência da API */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latência da API</span>
            <Activity className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">12ms</h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Tempo de resposta ideal (RNF04)</p>
          </div>
        </div>

        {/* Card 5: Gráfico Consolidado */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl lg:col-span-3 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Produtividade Semanal Consolidada</h3>
              <p className="text-xs text-slate-500">Volume consolidado de entregas da equipe (Throughput)</p>
            </div>
          </div>

          <div className="h-60 flex flex-col justify-between border-l border-b border-slate-200 pl-4 pb-2 relative">
            <div className="flex justify-around items-end h-full w-full gap-8 pt-6">
              <div className="w-16 bg-gradient-to-t from-slate-200 to-slate-300 h-[25%] rounded-t-xl relative flex justify-center">
                <span className="text-[9px] text-slate-500 absolute -top-5">Iniciadas</span>
              </div>
              <div className="w-16 bg-gradient-to-t from-[#6CBED9]/30 to-[#6CBED9]/50 h-[55%] rounded-t-xl relative flex justify-center">
                <span className="text-[9px] text-[#30728d] absolute -top-5">Em Curso</span>
              </div>
              <div className="w-16 bg-gradient-to-t from-[#30728d]/40 to-[#30728d]/70 h-[80%] rounded-t-xl relative flex justify-center">
                <span className="text-[9px] text-[#30728d] absolute -top-5">Entregues</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Moderação de Pausas */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Moderação de Pausas</h3>
            <p className="text-xs text-slate-500">Solicitações de folga pendentes (RN02)</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-48 pr-1 flex-1 mt-2">
            {pendingBlocks.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                Sem solicitações pendentes.
              </div>
            ) : (
              pendingBlocks.map((block) => (
                <div key={block.id} className="p-3 bg-[#F8FAF8] border border-slate-200 rounded-xl flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{block.user_name}</h4>
                      <p className="text-[9px] text-slate-500">{categoryLabels[block.category]}</p>
                    </div>
                    {block.proof_url && (
                      <a 
                        href={block.proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[8px] bg-[#30728d]/10 text-[#30728d] border border-[#30728d]/25 px-1.5 py-0.5 rounded flex items-center gap-0.5 hover:bg-[#30728d]/20 font-semibold"
                      >
                        <FileText className="w-2.5 h-2.5" /> Atestado
                      </a>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-650 bg-slate-100 p-1.5 rounded font-mono">
                    <span>{formatDate(block.starts_at)}</span>
                    <span>{formatTimeRange(block.starts_at, block.ends_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 self-end">
                    <button 
                      onClick={() => handleModerateBlock(block, 'approved')}
                      disabled={moderatingId === block.id}
                      className="p-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-200 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleModerateBlock(block, 'rejected')}
                      disabled={moderatingId === block.id}
                      className="p-1 bg-rose-100 text-rose-700 border border-rose-200 rounded hover:bg-rose-200 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 7: Membros da Equipe */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl md:col-span-3 lg:col-span-4 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Membros da Equipe</h3>
            <p className="text-xs text-slate-500">Controle de elegibilidade de acesso e throughput (RN01 / RN05)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-4">Colaborador</th>
                  <th className="pb-4">Crédito Disponível</th>
                  <th className="pb-4">Elegibilidade Flex</th>
                  <th className="pb-4">Rendimento Semanal (Min. 70%)</th>
                  <th className="pb-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Nenhum colaborador vinculado a este gestor no banco de dados.
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((colab) => (
                    <tr key={colab.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold text-slate-800">{colab.name}</div>
                        <div className="text-[10px] text-slate-500">{colab.email}</div>
                      </td>
                      <td className="py-4 font-mono font-bold text-slate-655 text-sm">
                        {colab.hours_available.toFixed(1)}h / 8.0h
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                          colab.flex_eligible 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }`}>
                          {colab.flex_eligible ? 'Elegível' : 'Acesso Suspenso'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold w-8 ${colab.performance >= 70 ? 'text-slate-700' : 'text-rose-600 font-black'}`}>
                            {colab.performance}%
                          </span>
                          <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div 
                              className={`h-full rounded-full ${
                                colab.performance >= 70 ? 'bg-gradient-to-r from-[#6CBED9] to-[#30728d]' : 'bg-rose-500'
                              }`}
                              style={{ width: `${colab.performance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleEligibility(colab)}
                          className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            colab.flex_eligible 
                              ? 'bg-rose-50 text-rose-750 border-rose-200 hover:bg-rose-100' 
                              : 'bg-[#30728d]/10 text-[#30728d] border-[#30728d]/20 hover:bg-[#30728d]/20'
                          }`}
                        >
                          {colab.flex_eligible ? (
                            <>
                              <Lock className="w-3 h-3" /> Suspender
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" /> Reativar
                            </>
                          )}
                        </button>

                        {colab.performance < 70 && (
                          <button 
                            onClick={() => handleOpenTicket(colab.id)}
                            className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 border border-amber-250 text-amber-700 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <AlertOctagon className="w-3 h-3" /> Alinhamento
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal de Abertura de Chamado */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full relative space-y-6 shadow-xl text-slate-700">
            <button 
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-500" /> Registrar Chamado de Alinhamento
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Acompanhamento para colaborador devido a baixo rendimento (RN05) ou fadiga (NR-01).
              </p>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Tipo de Alinhamento</label>
                <select 
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#30728d]"
                >
                  <option value="performance_alignment">Alinhamento de Produtividade (Throughput &lt; 70%)</option>
                  <option value="overwork_warning">Prevenção de Sobrecarga / Fadiga (NR-01)</option>
                  <option value="general_notification">Notificação Geral</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Descrição / Feedback de Alinhamento</label>
                <textarea 
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={4}
                  placeholder="Descreva o plano acordado, alertas de saúde ou feedback de alinhamento..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#30728d] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold transition-all text-center cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={sendingTicket}
                  className="flex-1 py-2.5 rounded-lg bg-[#30728d] text-white hover:opacity-90 font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  {sendingTicket && <Loader2 className="w-4 h-4 animate-spin" />}
                  Registrar Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
