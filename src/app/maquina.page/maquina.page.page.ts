import { Component, OnInit, inject } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
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
  constructOutline, warningOutline, chevronUpOutline,
  chevronDownOutline,
} from 'ionicons/icons';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { Maquina } from '../models';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maquina.page',
  templateUrl: './maquina.page.page.html',
  styleUrls: ['./maquina.page.page.scss'],
  imports: [
    IonContent,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    AppHeaderComponent]
})
export class MaquinaPagePage implements OnInit {
  maquinas: Maquina[] = [];
  expandida: string | null = null;
  carregando = true;


  private firebaseService = inject(FirebaseService);
  constructor() {
    addIcons({ constructOutline, warningOutline });
  }

  ngOnInit(): void {
    this.carregarMaquinas();
  }

  carregarMaquinas(): void {
    this.firebaseService.getMaquina().subscribe({
      next: (dados) => {
        this.maquinas = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar máquinas', erro);
        this.carregando = false;
      }
    });
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
