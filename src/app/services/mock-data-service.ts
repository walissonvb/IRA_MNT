import { Service } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import {
  Maquina,
  Equipe,
  TecnicaPreditiva,
  Rota,
  OrdemServico,
  ItemAlmoxarifado,
  DashboardData,
  RotaStop,
} from '../models';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })

export class MockDataService {
  readonly tecnicas: TecnicaPreditiva[] = [
    { id: 'termografia', nome: 'Termografia', icon: 'thermometer-outline', unidade: '°C', campoPrincipal: 'temperatura', descricao: 'Temperatura de superfície' },
    { id: 'vibracao', nome: 'Coleta de vibração', icon: 'pulse-outline', unidade: 'mm/s', campoPrincipal: 'velocidade_rms', descricao: 'Velocidade RMS' },
    { id: 'oleo', nome: 'Coleta de óleo', icon: 'water-outline', unidade: '', campoPrincipal: 'aspecto', descricao: 'Aspecto / amostra' },
    { id: 'megometro', nome: 'Megômetro', icon: 'flash-outline', unidade: 'MΩ', campoPrincipal: 'isolamento', descricao: 'Resistência de isolamento' },
    { id: 'amperagem', nome: 'Amperagem', icon: 'speedometer-outline', unidade: 'A', campoPrincipal: 'corrente', descricao: 'Corrente de operação' },
    { id: 'corrente', nome: 'Corrente / tensão', icon: 'analytics-outline', unidade: 'A / V', campoPrincipal: 'corrente_tensao', descricao: 'Parâmetros elétricos' },
    { id: 'visual', nome: 'Inspeção visual', icon: 'eye-outline', unidade: '', campoPrincipal: 'parecer', descricao: 'Parecer visual' },
    { id: 'lubrificacao', nome: 'Lubrificação', icon: 'construct-outline', unidade: 'g', campoPrincipal: 'quantidade', descricao: 'Quantidade aplicada' },
    { id: 'ultrassom', nome: 'Ultrassom', icon: 'radio-outline', unidade: 'dB', campoPrincipal: 'nivel_db', descricao: 'Nível ultrassônico' },
    { id: 'alinhamento', nome: 'Alinhamento', icon: 'git-compare-outline', unidade: 'mm', campoPrincipal: 'desvio', descricao: 'Desvio angular/paralelo' },
  ];

  readonly equipes: Equipe[] = [
    { id: 'eq1', nome: 'Equipe A — Mecânica', membros: ['Carlos Silva', 'João Mendes'] },
    { id: 'eq2', nome: 'Equipe B — Elétrica', membros: ['Ana Costa', 'Pedro Lima'] },
    { id: 'eq3', nome: 'Equipe C — Preditiva', membros: ['Mariana Souza', 'Rafael Dias'] },
  ];

  private maquinas: Maquina[] = [
    {
      id: 'm1', tag: 'BOM-01', nome: 'Bomba Centrífuga 01', setor: 'Utilidades', local: 'Casa de bombas', critica: true,
      pecas: [
        { id: 'p1', nome: 'Selo mecânico', codigo: 'SM-BOM-01', qtdMinima: 1, qtdAtual: 2, unidade: 'un' },
        { id: 'p2', nome: 'Rolamento 6309', codigo: 'ROL-6309', qtdMinima: 2, qtdAtual: 1, unidade: 'un' },
      ],
    },
    {
      id: 'm2', tag: 'MOT-12', nome: 'Motor Elétrico 75kW', setor: 'Produção', local: 'Linha 2', critica: true,
      pecas: [
        { id: 'p3', nome: 'Ventilador', codigo: 'VEN-MOT-75', qtdMinima: 1, qtdAtual: 0, unidade: 'un' },
      ],
    },
    {
      id: 'm3', tag: 'RED-03', nome: 'Redutor de velocidade', setor: 'Produção', local: 'Linha 1', critica: false,
      pecas: [],
    },
    {
      id: 'm4', tag: 'COM-02', nome: 'Compressor de ar', setor: 'Utilidades', local: 'Casa de máquinas', critica: true,
      pecas: [
        { id: 'p4', nome: 'Filtro de ar', codigo: 'FIL-COM-02', qtdMinima: 2, qtdAtual: 3, unidade: 'un' },
      ],
    },
    {
      id: 'm5', tag: 'VEN-07', nome: 'Ventilador industrial', setor: 'Exaustão', local: 'Cobertura', critica: false,
      pecas: [],
    },
    {
      id: 'm6', tag: 'BOM-04', nome: 'Bomba dosadora', setor: 'Química', local: 'Área química', critica: false,
      pecas: [],
    },
  ];

  private rotas: Rota[] = [
    {
      id: 'r1',
      nome: 'Ronda semanal — Utilidades',
      tecnicas: ['termografia', 'vibracao', 'visual'],
      equipeId: 'eq3',
      equipeNome: 'Equipe C — Preditiva',
      status: 'planejada',
      criadaEm: '2026-10-20T08:00:00',
      stops: [
        { maquinaId: 'm1', tag: 'BOM-01', nome: 'Bomba Centrífuga 01', ordem: 1, concluido: false },
        { maquinaId: 'm4', tag: 'COM-02', nome: 'Compressor de ar', ordem: 2, concluido: false },
        { maquinaId: 'm2', tag: 'MOT-12', nome: 'Motor Elétrico 75kW', ordem: 3, concluido: false },
      ],
    },
    {
      id: 'r2',
      nome: 'Inspeção visual — Linha 1',
      tecnicas: ['visual', 'lubrificacao'],
      equipeId: 'eq1',
      equipeNome: 'Equipe A — Mecânica',
      status: 'em_execucao',
      criadaEm: '2026-10-21T07:30:00',
      iniciadaEm: '2026-10-22T08:15:00',
      stops: [
        { maquinaId: 'm3', tag: 'RED-03', nome: 'Redutor de velocidade', ordem: 1, concluido: true, leituras: { parecer: 'OK' }, julgamento: 'normal', registradoEm: '2026-10-22T08:20:00' },
        { maquinaId: 'm5', tag: 'VEN-07', nome: 'Ventilador industrial', ordem: 2, concluido: false },
        { maquinaId: 'm6', tag: 'BOM-04', nome: 'Bomba dosadora', ordem: 3, concluido: false },
      ],
    },
  ];

  private ordens: OrdemServico[] = [
    {
      uid: 'os1',
      protocolo: 'OS-2026-0142',
      maquinaId: 'm2',
      maquinaTag: 'MOT-12',
      maquinaNome: 'Motor Elétrico 75kW',
      descricao: 'Ruído anormal no mancal dianteiro. Verificar rolamentos.',
      prioridade: 'alta',
      status: 'aberta',
      abertaEm: Timestamp.now(),
      nomeUsuario: 'John Doe',
      setor: 'Manutenção',
      natureza: 'Mecânica',
      dataAbertura: Timestamp.now(),
      dataFechamento: Timestamp.now(),
    },
  ];

  private almox: ItemAlmoxarifado[] = [
    { id: 'a1', codigo: 'ROL-6309', nome: 'Rolamento 6309', categoria: 'Rolamentos', qtd: 1, qtdMinima: 2, unidade: 'un', localizacao: 'Prateleira A3' },
    { id: 'a2', codigo: 'VEN-MOT-75', nome: 'Ventilador motor 75kW', categoria: 'Elétrica', qtd: 0, qtdMinima: 1, unidade: 'un', localizacao: 'Prateleira B1' },
    { id: 'a3', codigo: 'SM-BOM-01', nome: 'Selo mecânico BOM-01', categoria: 'Vedação', qtd: 2, qtdMinima: 1, unidade: 'un', localizacao: 'Prateleira C2' },
    { id: 'a4', codigo: 'FIL-COM-02', nome: 'Filtro de ar compressor', categoria: 'Filtros', qtd: 3, qtdMinima: 2, unidade: 'un', localizacao: 'Prateleira D4' },
    { id: 'a5', codigo: 'GRA-EP2', nome: 'Graxa EP2', categoria: 'Lubrificantes', qtd: 8, qtdMinima: 4, unidade: 'kg', localizacao: 'Tambor 02' },
  ];

  // ——— Getters (simulam leitura Firebase) ———

  getMaquinas(): Maquina[] {
    return [...this.maquinas];
  }

  getMaquina(id: string): Maquina | undefined {
    return this.maquinas.find((m) => m.id === id);
  }

  getEquipes(): Equipe[] {
    return [...this.equipes];
  }

  getTecnicas(): TecnicaPreditiva[] {
    return [...this.tecnicas];
  }

  getRotas(): Rota[] {
    return this.rotas.map((r) => ({ ...r, stops: r.stops.map((s) => ({ ...s })) }));
  }

  getRota(id: string): Rota | undefined {
    const r = this.rotas.find((x) => x.id === id);
    return r ? { ...r, stops: r.stops.map((s) => ({ ...s })) } : undefined;
  }

  getOrdens(): OrdemServico[] {
    return [...this.ordens];
  }

  getAlmoxarifado(): ItemAlmoxarifado[] {
    return [...this.almox];
  }

  getDashboard(): DashboardData {
    const openRoutes = this.rotas.filter((r) => r.status !== 'concluida').length;
    const openOrders = this.ordens.filter((o) => o.status !== 'fechada').length;
    const lowStock = this.almox.filter((i) => i.qtd < i.qtdMinima).length;
    const alerts = this.buildAlerts();

    return {
      todayLabel: this.hojeLabel(),
      machineCount: this.maquinas.length,
      openRoutes,
      openOrders,
      lowStock,
      routes: this.getRotas().filter((r) => r.status !== 'concluida'),
      alerts,
    };
  }

  // ——— Mutations (simulam escrita Firebase) ———

  salvarRota(rota: Omit<Rota, 'id' | 'criadaEm'>): Rota {
    const nova: Rota = {
      ...rota,
      id: 'r' + Date.now(),
      criadaEm: new Date().toISOString(),
      stops: rota.stops.map((s, i) => ({ ...s, ordem: i + 1 })),
    };
    this.rotas = [nova, ...this.rotas];
    return nova;
  }

  atualizarStop(rotaId: string, stopOrdem: number, dados: Partial<RotaStop>): Rota | undefined {
    const rota = this.rotas.find((r) => r.id === rotaId);
    if (!rota) return undefined;

    const stop = rota.stops.find((s) => s.ordem === stopOrdem);
    if (!stop) return undefined;

    Object.assign(stop, dados, { registradoEm: new Date().toISOString() });

    const todos = rota.stops.every((s) => s.concluido);
    if (todos) {
      rota.status = 'concluida';
      rota.concluidaEm = new Date().toISOString();
    } else if (rota.status === 'planejada') {
      rota.status = 'em_execucao';
      rota.iniciadaEm = new Date().toISOString();
    }

    return this.getRota(rotaId);
  }

  criarOrdemDeRota(rotaId: string, stop: RotaStop, descricao: string): OrdemServico {
    const os: OrdemServico = {
      uid: 'os' + Date.now(),
      protocolo: `OS-2026-${String(this.ordens.length + 143).padStart(4, '0')}`,
      maquinaId: stop.maquinaId,
      maquinaTag: stop.tag,
      maquinaNome: stop.nome,
      descricao,
      prioridade: stop.julgamento === 'critico' ? 'critica' : 'alta',
      status: 'aberta',
      abertaEm: Timestamp.now(),
      origemRotaId: rotaId,
      nomeUsuario: 'John Doe', // Example user name, replace with actual user name
      setor: 'Setor Exemplo', // Example sector, replace with actual sector
      natureza: 'Natureza Exemplo', // Example nature, replace with actual nature
    };
    this.ordens = [os, ...this.ordens];
    return os;
  }

  private buildAlerts() {
    const alerts = [];
    for (const r of this.rotas) {
      for (const s of r.stops) {
        if (s.concluido && (s.julgamento === 'atencao' || s.julgamento === 'critico')) {
          const tec = this.tecnicas.find((t) => r.tecnicas.includes(t.id));
          alerts.push({
            id: `${r.id}-${s.ordem}`,
            tag: s.tag,
            machineName: s.nome,
            techniqueLabel: tec?.nome || r.tecnicas.join(', '),
            reading: s.leituras ? Object.values(s.leituras).join(' / ') : '—',
            judgment: s.julgamento!,
            recordedLabel: s.registradoEm ? this.formatHora(s.registradoEm) : undefined,
            sourceLabel: r.nome,
            link: `/execucao/${r.id}`,
          });
        }
      }
    }
    return alerts;
  }

  private hojeLabel(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  private formatHora(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
