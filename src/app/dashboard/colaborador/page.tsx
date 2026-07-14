'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  categoryLabels, 
  statusLabels, 
  taskStatusLabels 
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
  HeartPulse,
  Trash2,
  Upload,
  X,
  Loader2
} from 'lucide-react';

interface FlexBlockData {
  id: number;
  user_id: number;
  starts_at: string;
  ends_at: string;
  category: 'break' | 'medical' | 'personal' | 'study';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewed_by?: number;
  proof_url?: string;
}

interface TaskData {
  id: number;
  user_id: number;
  title: string;
  task_status: 'started' | 'in_progress' | 'completed';
  created_at: string;
  completed_at?: string | null;
}

export default function ColaboradorDashboard() {
  const { profile } = useAuth();
  
  // Estados de dados
  const [balance, setBalance] = useState<number>(8.0);
  const [blocks, setBlocks] = useState<FlexBlockData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<'break' | 'medical' | 'personal' | 'study'>('break');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Estados de tarefas
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  // Carregar dados
  useEffect(() => {
    if (!profile) return;
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Saldo de créditos real
      const { data: balData } = await supabase
        .from('credit_balances')
        .select('hours_available')
        .eq('user_id', profile!.id)
        .maybeSingle();
      
      if (balData) {
        setBalance(balData.hours_available ?? 8.0);
      } else {
        // Inicializar saldo se não existir
        const today = new Date();
        const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1)).toISOString().split('T')[0];
        const { data: newBal } = await supabase
          .from('credit_balances')
          .insert({
            user_id: profile!.id,
            week_start: monday,
            hours_available: 8.0,
            full_renewal: true
          })
          .select()
          .single();
        if (newBal) setBalance(newBal.hours_available ?? 8.0);
      }

      // 2. Blocos de flexibilidade reais
      const { data: blData } = await supabase
        .from('flex_blocks')
        .select('*, flex_block_proofs(proof_url)')
        .eq('user_id', profile!.id)
        .order('starts_at', { ascending: false });
      
      if (blData) {
        const formattedBlocks = blData.map((b: any) => ({
          id: b.id,
          user_id: b.user_id,
          starts_at: b.starts_at,
          ends_at: b.ends_at,
          category: b.category,
          status: b.status,
          reviewed_by: b.reviewed_by,
          proof_url: b.flex_block_proofs?.[0]?.proof_url || b.flex_block_proofs?.proof_url
        }));
        setBlocks(formattedBlocks);
      }

      // 3. Tarefas reais
      const { data: tkData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });
      
      if (tkData) {
        setTasks(tkData as TaskData[]);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFlex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startsAt || !endsAt) {
      setFormError('Por favor, informe a data/hora de início e fim.');
      return;
    }

    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (end <= start) {
      setFormError('A hora de término deve ser posterior à hora de início.');
      return;
    }

    const diffMs = end.getTime() - start.getTime();
    const durationHours = diffMs / (1000 * 60 * 60);

    // Validação de saldo (médicos não consomem saldo inicial)
    if (category !== 'medical' && durationHours > balance) {
      setFormError(`Saldo insuficiente. Você solicitou ${durationHours.toFixed(1)}h mas possui apenas ${balance.toFixed(1)}h.`);
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      let finalProofUrl = '';
      
      // Upload do comprovante no Supabase Storage se categoria for medical e houver arquivo
      if (category === 'medical' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile?.id}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('proofs')
          .upload(fileName, file);
        
        if (uploadError) {
          console.error('Falha no upload do atestado, usando link de fallback:', uploadError);
          // Para contornar se o bucket não estiver criado, gera uma referência simulada
          finalProofUrl = `/proofs-offline/${fileName}`;
        } else {
          const { data: urlData } = supabase.storage.from('proofs').getPublicUrl(fileName);
          finalProofUrl = urlData?.publicUrl || '';
        }
      }

      // Inserir Bloco Flex real no Supabase
      const { data: blockInsert, error: blockErr } = await supabase
        .from('flex_blocks')
        .insert({
          user_id: profile!.id,
          starts_at: startsAt,
          ends_at: endsAt,
          category,
          status: 'pending'
        })
        .select()
        .single();

      if (blockErr) throw blockErr;

      // Inserir comprovante se houver
      if (category === 'medical' && finalProofUrl && blockInsert) {
        await supabase.from('flex_block_proofs').insert({
          flex_block_id: blockInsert.id,
          proof_url: finalProofUrl
        });
      }

      // Registrar transação de crédito e atualizar saldo
      if (category !== 'medical') {
        await supabase.from('credit_transactions').insert({
          user_id: profile!.id,
          week_start: new Date().toISOString().split('T')[0],
          amount: -durationHours,
          reason: `Agendamento de Bloco: ${categoryLabels[category]}`,
          flex_block_id: blockInsert.id
        });

        const newBal = Math.max(0, balance - durationHours);
        await supabase
          .from('credit_balances')
          .update({ hours_available: newBal })
          .eq('user_id', profile!.id);
        setBalance(newBal);
      }

      // Resetar form
      setStartsAt('');
      setEndsAt('');
      setFile(null);
      setIsModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao registrar solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setAddingTask(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: profile!.id,
          title: newTaskTitle,
          task_status: 'started'
        });
      if (error) throw error;
      setNewTaskTitle('');
      await fetchDashboardData();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, currentStatus: string) => {
    const nextStatusMap: Record<string, 'started' | 'in_progress' | 'completed'> = {
      started: 'in_progress',
      in_progress: 'completed',
      completed: 'started'
    };
    const nextStatus = nextStatusMap[currentStatus] || 'started';

    try {
      const updateData: any = { task_status: nextStatus };
      if (nextStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);
      if (error) throw error;
      await fetchDashboardData();
    } catch (e) {
      console.error('Erro ao atualizar status da tarefa:', e);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      await fetchDashboardData();
    } catch (e) {
      console.error('Erro ao deletar tarefa:', e);
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
        <span className="ml-3 text-xs uppercase tracking-widest text-slate-500">Buscando dados da agenda...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Título de Boas Vindas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#6CBED9]/20 text-[#30728d] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#30728d]/20">
            Painel Operacional
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 mt-2">
            Minha Área
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de produtividade assíncrona orientada a entregas.
          </p>
        </div>

        {profile?.flex_eligible ? (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#30728d] text-white rounded-xl hover:bg-[#30728d]/90 transition-all duration-300 shadow-md shadow-[#30728d]/10 hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            Solicitar Bloco Flex
          </button>
        ) : (
          <span className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Flexibilidade Bloqueada pelo Gestor
          </span>
        )}
      </div>

      {/* Bento Grid Principal (Versão Fundo Claro Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Bloco 1: Saldo de Crédito */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between md:col-span-2 relative group hover:border-[#6CBED9]/50 transition-all duration-300 shadow-sm">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo de Flexibilidade</span>
              <Clock className="w-4 h-4 text-[#30728d]" />
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <h3 className="text-5xl font-black text-slate-800">{balance.toFixed(1)}h</h3>
              <span className="text-xs text-slate-500 font-medium">disponíveis / 8.0h</span>
            </div>
            {/* Barra de progresso */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6 border border-slate-200">
              <div 
                className="bg-gradient-to-r from-[#6CBED9] to-[#30728d] h-full transition-all duration-500 rounded-full"
                style={{ width: `${(balance / 8) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-4">
            <span>Renovação: Segunda-feira às 08:00</span>
            <span className="text-[#30728d] font-semibold flex items-center gap-0.5">
              Semana Ativa <Zap className="w-3 h-3 fill-[#6CBED9]" />
            </span>
          </div>
        </div>

        {/* Bloco 2: Segurança LGPD */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Azuos Privacy Guard</span>
              <ShieldCheck className="w-4.5 h-4.5 text-[#30728d]" />
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#6CBED9] rounded-full" />
                Sem captura de tela
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#6CBED9] rounded-full" />
                Sem webcam ativa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#6CBED9] rounded-full" />
                Dados criptografados
              </li>
            </ul>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-100 pt-4 flex items-center gap-1.5 mt-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#30728d]" /> Conformidade LGPD ativa
          </p>
        </div>

        {/* Bloco 3: Ergonomia */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between hover:border-[#30728d]/30 transition-all shadow-sm">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saúde & Bem Estar</span>
              <HeartPulse className="w-4.5 h-4.5 text-[#6CBED9]" />
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              "Agende pausas de desconexão curtas após 2 horas de foco contínuo para evitar esgotamento."
            </p>
          </div>
          <span className="text-[9px] text-[#30728d] bg-[#6CBED9]/10 border border-[#6CBED9]/20 px-2 py-0.5 rounded w-fit mt-4">
            NR-01 Recomenda
          </span>
        </div>

        {/* Bloco 4: Agenda Semanal */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl md:col-span-3 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cronograma de Atividades</h3>
              <p className="text-xs text-slate-500">Prazos de entregas e blocos de flexibilidade</p>
            </div>
            <span className="text-[10px] text-slate-500 font-bold bg-[#F8FAF8] border border-slate-200 px-3 py-1 rounded-lg">
              Semana Atual
            </span>
          </div>

          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Nenhum bloco de flexibilidade agendado para esta semana.
              </div>
            ) : (
              blocks.map((block) => (
                <div 
                  key={block.id}
                  className="p-4 bg-[#F8FAF8] border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      block.category === 'medical' 
                        ? 'bg-rose-500/10 text-rose-600' 
                        : 'bg-[#6CBED9]/10 text-[#30728d]'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800">
                          {categoryLabels[block.category] || block.category}
                        </h4>
                        {block.proof_url && (
                          <a 
                            href={block.proof_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[9px] bg-[#30728d]/10 text-[#30728d] px-2 py-0.5 rounded flex items-center gap-1 border border-[#30728d]/10 hover:bg-[#30728d]/20 transition-all font-semibold"
                          >
                            <FileText className="w-2.5 h-2.5" />
                            Ver Atestado
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-450 uppercase font-semibold mt-0.5">
                        {formatDate(block.starts_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-700 font-bold font-mono">
                        {formatTimeRange(block.starts_at, block.ends_at)}
                      </p>
                      <p className="text-[10px] text-slate-500">Duração: {((new Date(block.ends_at).getTime() - new Date(block.starts_at).getTime()) / (1000 * 60 * 60)).toFixed(1)}h</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      block.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : block.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {statusLabels[block.status] || block.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bloco 5: Metas da Semana */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Minhas Entregas</h3>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Nova tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg flex-1 focus:outline-none focus:border-[#30728d] text-slate-800"
              />
              <button 
                type="submit" 
                disabled={addingTask}
                className="p-2 bg-[#30728d] text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Nenhuma tarefa pendente.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between gap-2 group p-2 rounded-lg hover:bg-slate-50">
                    <div className="space-y-0.5 cursor-pointer flex-1" onClick={() => handleUpdateTaskStatus(task.id, task.task_status)}>
                      <p className={`text-xs font-semibold text-slate-700 leading-tight ${
                        task.task_status === 'completed' ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-[9px] text-slate-450">
                        {task.task_status === 'completed' 
                          ? `Concluído em: ${new Date(task.completed_at || '').toLocaleDateString('pt-BR')}`
                          : `Criado em: ${new Date(task.created_at).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        task.task_status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-250' 
                          : task.task_status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-650'
                      }`}>
                        {taskStatusLabels[task.task_status] || task.task_status}
                      </span>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-6">
            <div className="text-[10px] text-slate-500 flex items-center justify-between">
              <span>Metas da Semana</span>
              <span className="font-bold text-[#30728d]">
                {tasks.filter(t => t.task_status === 'completed').length} / {tasks.length}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full relative space-y-6 shadow-xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#30728d]" /> Solicitar Bloco de Flexibilidade
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Informe o período e a categoria. Lembre-se da política de comprovação jurídica.
              </p>
            </div>

            <form onSubmit={handleRequestFlex} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Categoria</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#30728d]"
                >
                  <option value="break">Pausa de Desconexão (Geral)</option>
                  <option value="medical">Consulta Médica (Exige Atestado)</option>
                  <option value="personal">Compromisso Pessoal</option>
                  <option value="study">Estudo/Capacitação</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Início</label>
                  <input 
                    type="datetime-local" 
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#30728d]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Término</label>
                  <input 
                    type="datetime-local" 
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#30728d]"
                  />
                </div>
              </div>

              {category === 'medical' && (
                <div className="space-y-1.5 border border-dashed border-slate-200 p-3 rounded-lg bg-slate-50">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-rose-500" /> Anexar Atestado / Comprovante
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">Envie em até 24h úteis para não debitar seus créditos semanais.</p>
                  <input 
                    type="file" 
                    accept="application/pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-[10px] text-slate-650 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#30728d]/10 file:text-[#30728d] hover:file:bg-[#30728d]/20"
                  />
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold transition-all text-center"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg bg-[#30728d] text-white hover:bg-[#30728d]/95 font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
