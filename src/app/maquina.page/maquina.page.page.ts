import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonButton,

} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  constructOutline, warningOutline,
} from 'ionicons/icons';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { Maquina, StatCard } from '../models';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { CarrocelComponent } from '../carrocel/carrocel.component';
import { firstValueFrom } from 'rxjs';
import { MachineCardComponent } from '../machine-card/machine-card.component';


@Component({
  standalone: true,
  selector: 'app-maquina.page',
  templateUrl: './maquina.page.page.html',
  styleUrls: ['./maquina.page.page.scss'],
  imports: [
    IonContent,
    CommonModule,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonButton,
    IonIcon,
    AppHeaderComponent,
    CarrocelComponent,
    MachineCardComponent
  ]
})
export class MaquinaPagePage implements OnInit {
  maquinas: Maquina[] = [];
  expandida: string | null = null;

  carregando = true;
  statsCarregados = false;

  stats: StatCard[] = [];

  private firebaseService = inject(FirebaseService);
  constructor() {
    addIcons({ constructOutline, warningOutline });
  }

  ngOnInit(): void {
    this.carregarMaquinas();
  }

  async carregarMaquinas(): Promise<void> {

    try {

      this.carregando = true;
      this.statsCarregados = false;

      const maquinas = await firstValueFrom(
        this.firebaseService.getMaquina()
      );

      this.maquinas = maquinas ?? [];

      this.stats = [
        {
          label: 'Máquinas',
          value: this.maquinas.length,
          hint: 'Total cadastrado',
          link: '/maquina'
        },
        {
          label: 'Críticas',
          value: this.maquinas.filter(
            m => m.status?.toLowerCase() === 'critico'
          ).length,
          hint: 'Prioridade alta',
          link: '/maquina'
        },
        {
          label: 'Com local',
          value: this.maquinas.filter(
            m => !!m.local?.trim()
          ).length,
          hint: 'Local preenchido',
          link: '/maquina'
        },
        {
          label: 'Setores',
          value: new Set(
            this.maquinas
              .map(m => m.setor)
              .filter(Boolean)
          ).size,
          hint: 'Setores distintos',
          link: '/maquina'
        }
      ];

      this.statsCarregados = true;

    } catch (erro) {

      console.error(erro);

    } finally {

      this.carregando = false;

    }
  }
  toggle(id: string): void {
    this.expandida =
      this.expandida === id
        ? null
        : id;
  }
  getStatusColor(status: string): string {
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
    return new Date(data).getTime() < Date.now();
  }

  editar(maquina: Maquina): void {
    console.log('Editar', maquina);
  }

  excluir(id: string): void {
    console.log('Excluir', id);
  }
}
