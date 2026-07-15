'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { categoryLabels } from '@/lib/mockData';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  Search, 
  ClipboardList, 
  CheckCircle, 
  Download,
  Loader2,
  Activity
} from 'lucide-react';

interface RHUserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  flex_eligible: boolean;
  manager_name: string;
}

interface RHProofItem {
  id: number;
  user_name: string;
  category: string;
  starts_at: string;
  ends_at: string;
  proof_url: string;
  proof_uploaded_at: string;
}

interface RHTicketItem {
  id: number;
  user_name: string;
  manager_name: string;
  description: string;
  type: string;
  created_at: string;
}

export default function RHDashboard() {
  const { profile } = useAuth();
  
  const [users, setUsers] = useState<RHUserItem[]>([]);
  const [proofs, setProofs] = useState<RHProofItem[]>([]);
  const [tickets, setTickets] = useState<RHTicketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    fetchRHData();
  }, [profile]);

  const fetchRHData = async () => {
    setLoading(true);
    try {
      // 1. Obter todos os usuários com dados de gestor
      const { data: usersData } = await supabase
        .from('users')
        .select('*');
      
      if (usersData) {
        const mappedUsers = await Promise.all(usersData.map(async (u: any) => {
          let managerName = 'Diretoria';
          if (u.manager_id && u.manager_id !== u.id) {
            const { data: mgr } = await supabase
              .from('users')
              .select('name')
              .eq('id', u.manager_id)
              .single();
            if (mgr) managerName = mgr.name;
          }
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            flex_eligible: u.flex_eligible,
            manager_name: managerName
          };
        }));
        setUsers(mappedUsers);
      }

      // 2. Atestados médicos via join
      const { data: proofsData } = await supabase
        .from('flex_block_proofs')
        .select('*, flex_blocks(*, users(name))');
      
      if (proofsData) {
        const formattedProofs = proofsData.map((p: any) => ({
          id: p.id,
          user_name: p.flex_blocks?.users?.name || 'Colaborador',
          category: p.flex_blocks?.category || 'medical',
          starts_at: p.flex_blocks?.starts_at || '',
          ends_at: p.flex_blocks?.ends_at || '',
          proof_url: p.proof_url,
          proof_uploaded_at: p.proof_uploaded_at
        }));
        setProofs(formattedProofs);
      }

      // 3. Chamados/Tickets de alinhamento
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*, users!tickets_user_id_fkey(name), opened:users!tickets_opened_by_fkey(name)');

      if (ticketsData) {
        const formattedTickets = ticketsData.map((t: any) => ({
          id: t.id,
          user_name: t.users?.name || 'Colaborador',
          manager_name: t.opened?.name || 'Gestor',
          description: t.description,
          type: t.type || 'performance_alignment',
          created_at: t.created_at
        }));
        setTickets(formattedTickets);
      }
    } catch (e) {
      console.error('Erro ao carregar dados de RH:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.manager_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#F8FAF8]">
        <Loader2 className="w-8 h-8 text-[#30728d] animate-spin" />
        <span className="ml-3 text-xs uppercase tracking-widest text-slate-500">Acessando central de auditoria...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative text-slate-805">
        {/* Header */}
        <div>
          <span className="text-[10px] bg-[#6CBED9]/25 text-[#30728d] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#30728d]/20">
            Departamento de Auditoria & Conformidade
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 mt-2">
            Painel de Recursos Humanos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoramento de elegibilidade de acesso, controle confidencial de atestados médicos e chamados legais (LGPD e NR-01).
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Colaboradores</span>
            <Users className="w-4.5 h-4.5 text-[#30728d]" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-805">{users.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Total de funcionários auditados</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atestados Arquivados</span>
            <FileText className="w-4.5 h-4.5 text-[#aaffd8]" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-805">{proofs.length}</h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Arquivo criptografado ativo
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chamados de Apoio</span>
            <ClipboardList className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-805">{tickets.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Acompanhamentos abertos</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conformidade LGPD</span>
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-805">100%</h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
              Minimização de dados ativa
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Auditoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Colaboradores */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl lg:col-span-2 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Elegibilidade & Hierarquia</h3>
              <p className="text-xs text-slate-500">Lista geral de colaboradores e seus gestores</p>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-3 py-2 pl-8 rounded-lg w-full sm:w-60 focus:outline-none focus:border-[#30728d] text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-4">Nome</th>
                  <th className="pb-4">Cargo / Função</th>
                  <th className="pb-4">Gestor Direto</th>
                  <th className="pb-4">Elegibilidade Flex</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      Nenhum colaborador encontrado no banco de dados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-semibold text-slate-800">{user.name}</td>
                      <td className="py-4">
                        <span className="font-mono text-slate-500 capitalize">{user.role}</span>
                      </td>
                      <td className="py-4 text-slate-550">{user.manager_name}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                          user.flex_eligible 
                            ? 'bg-emerald-100 text-emerald-705 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-705 border border-rose-200'
                        }`}>
                          {user.flex_eligible ? 'Elegível' : 'Acesso Bloqueado'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Central de Atestados Confidenciais */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-wider">Arquivo Confidencial</h3>
            <p className="text-xs text-slate-500">Auditoria restrita de atestados (Minimização LGPD)</p>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {proofs.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-450 border border-dashed border-slate-200 rounded-xl">
                Nenhum comprovante médico anexado no sistema.
              </div>
            ) : (
              proofs.map((proof) => (
                <div key={proof.id} className="p-4 bg-[#F8FAF8] border border-slate-200 rounded-xl space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-slate-850">{proof.user_name}</h4>
                      <p className="text-[9px] text-slate-400">Enviado em: {new Date(proof.proof_uploaded_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <a 
                      href={proof.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#30728d]/10 text-[#30728d] border border-[#30728d]/20 rounded hover:bg-[#30728d]/20 transition-all flex items-center justify-center cursor-pointer"
                      title="Download/Visualizar Atestado"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-[9.5px] text-slate-600 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span className="text-[#30728d] font-bold">{categoryLabels[proof.category] || proof.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Início:</span>
                      <span>{new Date(proof.starts_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fim:</span>
                      <span>{new Date(proof.ends_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Central de Chamados de Acompanhamento (NR-01) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl lg:col-span-3 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-805 uppercase tracking-wider">Acompanhamentos de Ergonomia & Saúde (NR-01)</h3>
            <p className="text-xs text-slate-500">Histórico de chamados de alinhamento psicossocial gerados por gestores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-450 border border-dashed border-slate-100 rounded-xl col-span-full">
                Nenhum chamado de alinhamento aberto no banco de dados.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-4 bg-[#F8FAF8] border border-slate-200 rounded-xl flex flex-col justify-between gap-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        t.type === 'overwork_warning' 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-105 text-amber-700 border border-amber-200'
                      }`}>
                        {t.type === 'overwork_warning' ? 'Saúde NR-01' : 'Alinhamento Meta'}
                      </span>
                      <span className="text-[9px] text-slate-400">{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <h4 className="font-bold text-xs text-slate-800">
                      {t.user_name} <span className="text-[10px] text-slate-500 font-normal">subordinado a {t.manager_name}</span>
                    </h4>
                    
                    <p className="text-slate-600 leading-relaxed text-[11px] italic">
                      "{t.description}"
                    </p>
                  </div>
                  
                  <div className="text-[9.5px] text-[#30728d] border-t border-slate-200 pt-2 flex items-center gap-1 font-semibold">
                    <Activity className="w-3.5 h-3.5 text-[#30728d]" />
                    <span>Canal de Apoio Ativo</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
