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

  readonly equipes: Equipe[] = [
    { id: 'eq1', nome: 'Equipe A — Mecânica', membros: ['Carlos Silva', 'João Mendes'] },
    { id: 'eq2', nome: 'Equipe B — Elétrica', membros: ['Ana Costa', 'Pedro Lima'] },
    { id: 'eq3', nome: 'Equipe C — Preditiva', membros: ['Mariana Souza', 'Rafael Dias'] },
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


  getEquipes(): Equipe[] {
    return [...this.equipes];
  }

}