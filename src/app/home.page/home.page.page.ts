import { Component } from '@angular/core';
import { IonContent, IonButton, IonSpinner, ViewWillEnter,  } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { MockDataService } from '../services/mock-data-service';
import { DashboardStat, DashboardAlerta, Rota, Maquina,} from '../models/index';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

const STATUS_LABEL: Record<string, string> = {
  planejada: 'Planejada',
  em_execucao: 'Em execução',
  concluida:
   'Concluída',
};

const JULGAMENTO_LABEL: Record<string, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};


@Component({
  selector: 'app-home.page',
  templateUrl: './home.page.page.html',
  styleUrls: ['./home.page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonSpinner,
    RouterLink,
    AppHeaderComponent,
  ],
})
export class HomePagePage implements ViewWillEnter {
  maquina: Observable<Maquina[]> | undefined;
  listaMaquinas: Maquina[] = [];
  carregando = true;
  erro = '';
  kicker = 'Planta Norte';

  stats: DashboardStat[] = [];
  rotas: Rota[] = [];
  alertas: DashboardAlerta[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private data: MockDataService,
  ) {
    this.maquina = this.firebaseService.getMaquina();
 this.maquina.subscribe({
      next: (dados) => {
        console.log('Máquinas do Firebase:', dados);
        this.listaMaquinas = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar máquinas:', err);
      }
    }); 
}

  ionViewWillEnter(): void {
    void this.carregar();
  }

  async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = '';

    try {
      
      // Trocar por chamada Firebase quando disponível
      const d = this.data.getDashboard();

      this.kicker = `Planta Norte · ${d.todayLabel}`;
      this.stats = [
        { label: 'Máquinas', value: d.machineCount, link: '/maquinas' },
        { label: 'Rotas abertas', value: d.openRoutes, link: '/lista-rotas' },
        { label: 'OS abertas', value: d.openOrders, link: '/ordens' },
        { label: 'Abaixo do mínimo', value: d.lowStock, link: '/almoxarifado' },
      ];
      this.rotas = d.routes;
      this.alertas = d.alerts;
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Não foi possível carregar o painel.';
      this.stats = [];
      this.rotas = [];
      this.alertas = [];
    } finally {
      this.carregando = false;
    }
  }

  progresso(rota: Rota): number {
    const total = rota.stops.length;
    if (!total) return 0;
    const done = rota.stops.filter((s) => s.concluido).length;
    return Math.round((done / total) * 100);
  }

  doneCount(rota: Rota): number {
    return rota.stops.filter((s) => s.concluido).length;
  }

  rotuloStatus(status: string): string {
    return STATUS_LABEL[status] || status || '—';
  }

  rotuloJulgamento(valor: string): string {
    return JULGAMENTO_LABEL[valor] || valor || '—';
  }

  abrir(link: string): void {
    if (link) void this.router.navigateByUrl(link);
  }

  abrirExecucao(id: string): void {
    void this.router.navigate(['/execucao', id]);
  }
}
