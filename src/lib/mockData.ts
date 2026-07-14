export type UserRole = 'collaborator' | 'manager';

export interface Profile {
  id: number; // bigint
  name: string;
  email: string;
  role: UserRole; // Enum 'collaborator' | 'manager'
  flexEligible: boolean; // flex_eligible
  isHr: boolean; // is_hr
  managerId: number; // manager_id
  authUid?: string; // auth_uid
  managerName?: string; // Preenchido via join
}

export interface CreditBalance {
  id: number;
  userId: number; // user_id
  weekStart: string; // week_start (date)
  hoursAvailable: number; // hours_available
  fullRenewal: boolean; // full_renewal
}

export interface FlexBlock {
  id: number;
  userId: number; // user_id
  userName?: string; // Preenchido via join
  category: string; // Enum 'break' | 'medical' | 'personal' | 'study'
  startsAt: string; // starts_at (timestamp)
  endsAt: string; // ends_at (timestamp)
  status: string; // Enum 'pending' | 'approved' | 'rejected' | 'cancelled'
  reviewedBy?: number; // reviewed_by
  certificatePath?: string; // Preenchido via join com flex_block_proofs.proof_url
  createdAt: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  taskStatus: string; // task_status (started, in_progress, completed)
  createdAt: string;
  completedAt?: string;
}

// ----------------------------------------------------
// DICIONÁRIOS DE TRADUÇÃO DE ENUMS DO BANCO REAL
// ----------------------------------------------------

export const categoryLabels: Record<string, string> = {
  break: 'Pausa de Desconexão',
  medical: 'Consulta Médica',
  personal: 'Compromisso Pessoal',
  study: 'Estudo/Capacitação'
};

export const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado'
};

export const taskStatusLabels: Record<string, string> = {
  started: 'Iniciada',
  in_progress: 'Em Andamento',
  completed: 'Concluída'
};

// ----------------------------------------------------
// DADOS DE TESTE (MOCKS ATUALIZADOS CONFORME O SQL)
// ----------------------------------------------------

export const mockCollaborator: Profile = {
  id: 123,
  name: 'Gabriela Silva',
  email: 'gabriela.silva@azuos.com.br',
  role: 'collaborator',
  flexEligible: true,
  isHr: false,
  managerId: 456,
  managerName: 'Renato Mota',
};

export const mockManager: Profile = {
  id: 456,
  name: 'Renato Mota',
  email: 'renato.mota@azuos.com.br',
  role: 'manager',
  flexEligible: true,
  isHr: false,
  managerId: 456,
};

export const mockCreditBalance: CreditBalance = {
  id: 1,
  userId: 123,
  weekStart: '2026-07-13',
  hoursAvailable: 5.5,
  fullRenewal: true,
};

export const mockFlexBlocks: FlexBlock[] = [
  {
    id: 1,
    userId: 123,
    userName: 'Gabriela Silva',
    category: 'medical',
    startsAt: '2026-07-14T10:00:00-03:00',
    endsAt: '2026-07-14T12:00:00-03:00',
    status: 'approved',
    certificatePath: '/files/atestado1.pdf',
    createdAt: '2026-07-13T14:22:00Z',
    reviewedBy: 456,
  },
  {
    id: 2,
    userId: 123,
    userName: 'Gabriela Silva',
    category: 'break',
    startsAt: '2026-07-15T15:00:00-03:00',
    endsAt: '2026-07-15T15:30:00-03:00',
    status: 'approved',
    createdAt: '2026-07-14T09:00:00Z',
    reviewedBy: 456,
  },
  {
    id: 3,
    userId: 123,
    userName: 'Gabriela Silva',
    category: 'personal',
    startsAt: '2026-07-16T14:00:00-03:00',
    endsAt: '2026-07-16T15:30:00-03:00',
    status: 'pending',
    createdAt: '2026-07-14T09:30:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 10,
    userId: 123,
    title: 'Modelagem de dados do sistema de créditos',
    taskStatus: 'completed',
    dueDate: '2026-07-14', // Mantido como referência visual para o mock
    createdAt: '2026-07-13T09:00:00Z',
    completedAt: '2026-07-14T11:00:00Z',
  },
  {
    id: 11,
    userId: 123,
    title: 'Implementação da tela de login e middleware de acesso',
    taskStatus: 'in_progress',
    dueDate: '2026-07-14',
    createdAt: '2026-07-13T09:00:00Z',
  },
  {
    id: 12,
    userId: 123,
    title: 'Integração dos gráficos do painel de gestor',
    taskStatus: 'started',
    dueDate: '2026-07-15',
    createdAt: '2026-07-14T08:30:00Z',
  },
  {
    id: 13,
    userId: 123,
    title: 'Desenvolvimento do modal de upload de comprovantes',
    taskStatus: 'started',
    dueDate: '2026-07-15',
    createdAt: '2026-07-14T08:45:00Z',
  },
];

export const mockTeamCredits = [
  {
    id: 123,
    name: 'Gabriela Silva',
    email: 'gabriela.silva@azuos.com.br',
    hoursAvailable: 5.5,
    isEligible: true,
    performance: 82,
  },
  {
    id: 999,
    name: 'João Souza',
    email: 'joao.souza@azuos.com.br',
    hoursAvailable: 8.0,
    isEligible: true,
    performance: 65,
  },
  {
    id: 888,
    name: 'Ana Costa',
    email: 'ana.costa@azuos.com.br',
    hoursAvailable: 2.0,
    isEligible: false,
    performance: 45,
  },
];
