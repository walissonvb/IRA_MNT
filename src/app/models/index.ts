import { Timestamp } from 'firebase/firestore';

/* =====================================================
 * ENUMS
 * ===================================================== */

export type StatusRota =
  | 'planejada'
  | 'em_execucao'
  | 'concluida';

export type Julgamento =
  | 'normal'
  | 'atencao'
  | 'critico';

export type Prioridade =
  | 'baixa'
  | 'media'
  | 'alta'
  | 'critica';

/* =====================================================
 * NAVEGAÇÃO
 * ===================================================== */


export interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  ativo?: boolean;
}

/* =====================================================
 * TÉCNICAS PREDITIVAS
 * coleção: tecnicapreditiva
 * ===================================================== */

export interface TecnicaPreditiva {
  id: string;

  nome: string;

  icon: string;

  descricao?: string [];

  unidade?: string;

  campoPrincipal: string[];

  ativo?: boolean;

  ordem?: number;

  criadoEm?: Timestamp;
}

/* =====================================================
 * PEÇAS
 * ===================================================== */

export interface Peca {
  id: string;

  nome: string;

  codigo: string;

  qtdMinima: number;

  qtdAtual: number;

  unidade: string;
}

/* =====================================================
 * MÁQUINAS
 * coleção: maquina
 * ===================================================== */

export interface Maquina {
  id: string;

  tag: string;

  nome: string;

  descricao?: string;

  setor: string;

  local?: string;

  fabricante?: string;

  modelo?: string;

  patrimonio?: string;

  ativa?: boolean;

  /**
   * Técnicas permitidas
   * ids da coleção tecnicapreditiva
   */
  tecnicas?: string[];

  pecas?: Peca[];

  vibracaoGlobal?: number;

  temperatura?: number;

  lubrificacao?: string;

  anomalia?: string;

  pendencias?: string[];

  indiceSaude?: number;

  horasOperacao?: number;

  ultimaMedicao?: Date |  null;

  proximaManutencao?: Date | null;

  status?: Julgamento;

  criadoEm?: Timestamp;

  atualizadoEm?: Timestamp;
}

/* =====================================================
 * EQUIPE
 * coleção: equipe
 * ===================================================== */

export interface Equipe {
  id: string;

  nome: string;

  lider?: string;

  membros: string[];

  ativa?: boolean;

  criadoEm?: Timestamp;
}

/* =====================================================
 * ROTAS
 * coleção: rota
 * ===================================================== */


export interface RotaStop {
  maquinaId: string;

  tag: string;

  nome: string;

  ordem: number;

  concluido: boolean;

  julgamento?: Julgamento;  

  tecnicas: string[];

}


export interface Rota {
  id: string;

  nome: string;

  equipeId: string;

  equipeNome?: string;

  tecnicas: string[];

  status: StatusRota;

  stops: RotaStop[];

  criadoPor?: string;

abertaEm: Timestamp;
}
/* =====================================================
 * EXECUÇÕES
 * coleção: execucoes
 * ===================================================== */

export interface Execucao {
  id?: string;

  rotaId: string;

  rotaNome: string;

  equipeId: string;

  equipeNome?: string;

  status:
  | 'em_execucao'
  | 'concluida'
  | 'cancelada';

  iniciadoEm: Timestamp;

  finalizadoEm?: Timestamp;

  percentualConcluido?: number;
}

/* =====================================================
 * LEITURAS / COLETAS
 * coleção: leituras
 * ===================================================== */

export interface Leitura {
  id?: string;

  execucaoId: string;

  rotaId: string;

  maquinaId: string;

  tecnicaId: string;

  valor: string | number;

  unidade?: string;

  julgamento?: Julgamento;

  observacao?: string;

  anexoUrl?: string;

  usuarioId?: string;

  usuarioNome?: string;

  dataHora: Timestamp;
}

/* =====================================================
 * ORDENS DE SERVIÇO
 * coleção: ordens_servico
 * ===================================================== */

export interface OrdemServico {

  id?: string;

  protocolo?: string;

  uid: string;

  nomeUsuario: string;

  setor?: string;

  maquinaId: string;

  maquinaTag: string;

  maquinaNome: string;

  descricao: string;

  natureza: string;

  prioridade: Prioridade;

  status:
  | 'aberta'
  | 'em_andamento'
  | 'fechada';

  origemRotaId?: string;

  leituraId?: string;

  abertaEm: Timestamp;

  atualizadoEm?: Timestamp;

  dataFechamento?: Timestamp;
}

/* =====================================================
 * ESTOQUE / ALMOXARIFADO
 * ===================================================== */

export interface ItemAlmoxarifado {
  id: string;

  codigo: string;

  nome: string;

  categoria: string;

  qtd: number;

  qtdMinima: number;

  unidade: string;

  localizacao: string;
}

/* =====================================================
 * DASHBOARD
 * ===================================================== */

export interface StatCard {
  label: string;

  value: number | string;

  link: string;

  hint?: string;
}

export interface DashboardStat {
  label: string;

  value: number;

  link: string;
}

export interface DashboardAlerta {
  id: string;

  tag: string;

  machineName: string;

  techniqueLabel: string;

  reading: string;

  judgment: Julgamento;

  recordedLabel?: string;

  sourceLabel?: string;

  link?: string;
}

export interface DashboardData {
  todayLabel: string;

  machineCount: number;

  openRoutes: number;

  openOrders: number;

  lowStock: number;

  routes: Rota[];

  alerts: DashboardAlerta[];
}