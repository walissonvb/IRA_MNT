/** Modelos do domínio Ronda PCM */

export type StatusRota = 'planejada' | 'em_execucao' | 'concluida';
export type Julgamento = 'normal' | 'atencao' | 'critico';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  ativo?: boolean;
}

export interface TecnicaPreditiva {
  id: string;
  nome: string;
  icon: string;
  unidade?: string;
  campoPrincipal: string; // ex: temperatura, velocidade_mm_s
  descricao?: string;
}

export interface Peca {
  id: string;
  nome: string;
  codigo: string;
  qtdMinima: number;
  qtdAtual: number;
  unidade: string;
}

export interface Maquina {
  id: string;
  tag: string;
  nome: string;
  setor: string;
  local: string;
  pecas: Peca[];
  critica: boolean;
}

export interface Equipe {
  id: string;
  nome: string;
  membros: string[];
}

export interface RotaStop {
  maquinaId: string;
  tag: string;
  nome: string;
  ordem: number;
  concluido: boolean;
  leituras?: Record<string, number | string>;
  julgamento?: Julgamento;
  observacao?: string;
  registradoEm?: string;
}

export interface Rota {
  id: string;
  nome: string;
  tecnicas: string[]; // ids das técnicas
  equipeId: string;
  equipeNome?: string;
  status: StatusRota;
  stops: RotaStop[];
  criadaEm: string;
  iniciadaEm?: string;
  concluidaEm?: string;
}

export interface OrdemServico {
  id: string;
  numero: string;
  maquinaId: string;
  maquinaTag: string;
  maquinaNome: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberta' | 'em_andamento' | 'fechada';
  abertaEm: string;
  origemRotaId?: string;
}

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
