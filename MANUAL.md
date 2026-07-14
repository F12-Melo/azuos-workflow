# Manual do Usuário - Azuos Workflow Manager

Este manual detalha o funcionamento, arquitetura, fluxos operacionais e guias de instalação para o **Azuos Workflow Manager**. A plataforma foi desenvolvida sob o princípio de **Privacy by Design**, equilibrando a autonomia de tempo dos colaboradores com a produtividade orientada a entregas semanais (Throughput), garantindo conformidade total com a **LGPD** e com a **NR-01 (Saúde Ocupacional)**.

---

## 1. Visão Geral do Sistema

O modelo de trabalho remoto tradicional frequentemente recorre a táticas de monitoramento invasivo (gravações de câmera, keyloggers e capturas de tela) que geram exaustão mental (burnout) e insegurança jurídica corporativa. 

O **Azuos** resolve esse dilema através de:
1. **Sistema de Créditos de Flexibilidade**: O colaborador recebe um saldo de 8.0 horas semanais para realizar pausas pessoais ou profissionais sem a necessidade de expor detalhes de sua vida íntima.
2. **Gestão baseada em Throughput**: A produtividade é medida pelo volume de tarefas entregues (metas semanais) e não pela vigilância em tempo real.
3. **Privacidade Estrita (LGPD)**: Sem rastreamento invasivo. A gestão de atestados médicos é confidencial e restrita a quem de direito (RH e Gestores Diretos), com criptografia em repouso.
4. **Prevenção ao Overwork (NR-01)**: Direito à desconexão com disparos de notificações preventivas sobre fadiga e acompanhamento ativo de funcionários.

---

## 2. Instalação e Configuração

Como as tabelas e políticas de Row Level Security (RLS) já foram previamente criadas no Supabase, basta configurar a conexão no frontend.

### Passo 1: Configurar Variáveis de Ambiente
Crie um arquivo `.env` (ou `.env.local`) na raiz do diretório `azuos-workflow/` com os links e chaves do seu projeto no Supabase:

```env
# Configurações do Supabase para o Frontend Next.js
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica-do-supabase

# Conexão Direta com o Banco de Dados PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres:[sua-senha]@db.[sua-ref-projeto].supabase.co:6543/postgres?pgbouncer=true
```

### Passo 2: Inicializar o Frontend
Abra o console no diretório `azuos-workflow/` e instale as dependências executando:
```bash
npm install
```

Para rodar em ambiente de desenvolvimento:
```bash
npm run dev
```

O servidor local subirá no link: [http://localhost:3000](http://localhost:3000)

---

## 3. Contas de Teste Pré-Configuradas

Para facilitar a avaliação da plataforma sem a necessidade de cadastros iniciais, três contas padrão foram embutidas. Elas operam de forma persistente através do Supabase Auth e utilizam um mecanismo inteligente de fallback persistente local em localStorage caso a conexão do Supabase não esteja ativa.

| Perfil | E-mail de Acesso | Senha Padrão | Objetivo do Teste |
| :--- | :--- | :--- | :--- |
| **Colaborador** | `colaborador@azuos.com.br` | `password153` ou `password123` | Controlar saldo, adicionar tarefas de metas, solicitar blocos de folgas e anexar atestados. |
| **Gestor** | `gestor@azuos.com.br` | `password153` ou `password123` | Visualizar produtividade consolidada, moderar blocos de pausa da equipe, suspender/reativar acesso, criar chamados. |
| **RH** | `rh@azuos.com.br` | `password153` ou `password123` | Auditar atestados médicos arquivados de forma criptografada, acompanhar chamados de saúde mental, auditar logs. |

---

## 4. Fluxo de Trabalho por Perfis

### 4.1. Visão do Colaborador (`colaborador@azuos.com.br`)
O colaborador acessa seu painel pessoal onde pode gerenciar sua semana de forma assíncrona:
* **Cronograma de Atividades**: Mostra os blocos de pausa solicitados, aprovados ou pendentes.
* **Saldo de Flexibilidade**: Exibe o saldo restante das 8 horas semanais. O gráfico é atualizado de forma dinâmica.
* **Solicitar Bloco Flex**: Permite abrir um formulário para agendar uma folga. 
  * Se a categoria for *Pausa de Desconexão*, *Compromisso Pessoal* ou *Estudo*, o sistema valida se há saldo suficiente e deduz as horas do saldo após aprovação.
  * Se for *Consulta Médica*, a interface exibe uma área de **Upload de Atestado/Comprovante**. De acordo com a regra **RN03**, o envio do documento evita que as horas correspondentes sejam descontadas permanentemente do saldo do colaborador.
* **Minhas Entregas (Throughput)**: Painel de tarefas da semana corrente. O colaborador pode adicionar metas, atualizar seu progresso (Iniciada $\rightarrow$ Em Andamento $\rightarrow$ Concluída) e remover tarefas. A conclusão das tarefas atualiza a sua performance.

### 4.2. Visão do Gestor (`gestor@azuos.com.br`)
O gestor administra sua equipe de colaboradores diretos de forma macro:
* **Painel Geral de Equipe**: Monitora a quantidade de membros ativos, saldo médio disponível na equipe e quantos colaboradores estão abaixo de 70% das metas na semana corrente.
* **Mapeamento de Throughput**: Gráfico de colunas que ilustra o volume total de tarefas em andamento, iniciadas e concluídas de toda a sua equipe.
* **Moderação de Pausas**: Painel dinâmico que exibe solicitações pendentes. O gestor pode aprovar (confirmando o uso dos créditos) ou rejeitar (devolvendo os créditos ao saldo do colaborador no caso de blocos normais). Ele também pode visualizar atestados médicos anexados.
* **Ajustar Acesso (RN05)**: Se a performance do colaborador cair abaixo de 70% sem justificativa válida, o gestor tem autoridade para suspender sua elegibilidade aos blocos de flexibilidade. O colaborador é bloqueado de fazer novos agendamentos até que o acesso seja restabelecido.
* **Abertura de Chamado de Alinhamento**: O gestor pode abrir chamados preventivos (Saúde NR-01 ou Desempenho) para alinhamento psicossocial ou auxílio no redirecionamento de metas.

### 4.3. Visão do RH (`rh@azuos.com.br`)
O departamento de Recursos Humanos atua como auditor do sistema:
* **Conformidade Geral**: Monitora todos os colaboradores cadastrados e as respectivas hierarquias corporativas.
* **Controle de Atestados Confidenciais**: O RH tem acesso a uma galeria criptografada de todos os atestados médicos anexados na plataforma pelos funcionários. O download e a visualização desses documentos sensíveis são limitados estritamente ao RH e ao gestor direto para evitar vazamento de dados, cumprindo o princípio de minimização da LGPD.
* **Central de Acompanhamento Mental & Ergonomia**: O RH supervisiona todas as notificações corporativas emitidas por gestores em relação a horas excessivas ou baixos desempenhos de colaboradores, intervindo em conformidade com as diretrizes da NR-01.

---

## 5. Dicionário da Estrutura de Banco de Dados

Caso queira realizar queries manuais diretamente no editor SQL do Supabase:

### `public.users` (Tabela de Usuários)
Tabela principal de perfis, estendendo as credenciais de autenticação do Supabase Auth.
* `id` (`int8`): Chave primária.
* `name` (`text`): Nome completo do usuário.
* `email` (`text`): E-mail de cadastro.
* `manager_id` (`int8`): ID do gestor imediato (auto-referência).
* `flex_eligible` (`bool`): Permissão para o colaborador solicitar blocos.
* `role` (`role`): Enum de privilégios (`collaborator`, `manager`).
* `is_hr` (`bool`): Indicador de pertencimento ao time de RH.
* `auth_uid` (`uuid`): Vínculo com a tabela de credenciais `auth.users(id)`.

### `public.credit_balances` (Saldo de Créditos)
* `user_id` (`int8`): Vínculo do colaborador.
* `hours_available` (`float8`): Saldo líquido de créditos restantes para a semana ativa.
* `week_start` (`date`): Data da segunda-feira de início da semana ativa.

### `public.flex_blocks` (Reservas de Pausa)
* `user_id` (`int8`): Colaborador que agendou.
* `starts_at` / `ends_at` (`timestamp`): Data/Hora de início e fim da pausa.
* `category` (`category`): Categoria (`break`, `medical`, `personal`, `study`).
* `status` (`status`): Estado da solicitação (`pending`, `approved`, `rejected`, `cancelled`).

### `public.tasks` (Metas & Throughput)
* `user_id` (`int8`): Proprietário da tarefa.
* `title` (`text`): Título/descrição da entrega.
* `task_status` (`task_status`): Status (`started`, `in_progress`, `completed`).

### `public.tickets` (Chamados NR-01)
* `opened_by` (`int8`): Gestor que abriu o chamado.
* `user_id` (`int8`): Colaborador alvo do chamado.
* `description` (`text`): Detalhes do chamado.
* `type` (`type`): Categoria do chamado (`performance_alignment`, `overwork_warning`, `general_notification`).
