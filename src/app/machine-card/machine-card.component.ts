import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonButton
} from '@ionic/angular';

import {
  Maquina,
  TecnicaPreditiva
} from '../models';

@Component({
  selector: 'app-machine-card',
  standalone: true,
  templateUrl: './machine-card.component.html',
  styleUrls: ['./machine-card.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonButton
  ]
})
export class MachineCardComponent {
  @Input()
  tecnicasSelecionadas: string[] = [];

  @Input()
  anomaliasSelecionadas:
    Record<string, string[]> = {};

  @Input() maquina!: Maquina;

  @Input() tecnicas: TecnicaPreditiva[] = [];

  @Input()
  modo:
    | 'consulta'
    | 'selecao'
    | 'execucao' = 'consulta';

  @Input()
  selecionado = false;

  @Output()
  selecionar = new EventEmitter<Maquina>();

  @Output()
  editar = new EventEmitter<Maquina>();

  @Output()
  excluir = new EventEmitter<string>();

  @Output()
  toggle =
    new EventEmitter<Maquina>();

  getStatusColor(status?: string): string {

    switch (status?.toLowerCase()) {

      case 'critico':
        return 'danger';

      case 'atencao':
        return 'warning';

      case 'normal':
        return 'success';

      default:
        return 'medium';

    }

  }

  isOverdue(data: any): boolean {

    if (!data) {
      return false;
    }

    return new Date(data).getTime() < Date.now();

  }

}