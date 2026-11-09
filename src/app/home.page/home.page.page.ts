import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonButton, IonSpinner, IonCard } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { DashboardAlerta, Rota, Maquina, StatCard } from '../models/index';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { CarrocelComponent } from '../carrocel/carrocel.component';

const STATUS_LABEL: Record<string, string> = {
  planejada: 'Planejada',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
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
  imports: [IonCard, IonContent, IonButton, IonSpinner, RouterLink, AppHeaderComponent, CarrocelComponent],
})
export class HomePagePage implements OnInit, OnDestroy {
  carregando = true;
  statsCarregados = false;
  erro = '';
  kicker = 'Planta Norte';
  rotas: Rota[] = [];
  alertas: DashboardAlerta[] = [];
  slideAtivo = 0;

  stats: StatCard[] = [
    { label: 'Máquinas', value: '—', link: '//maquina.page' },
    { label: 'Críticas', value: '—', link: '//maquina.page' },
    { label: 'Com local', value: '—', link: '//maquina.page' },
    { label: 'Setores', value: '—', link: '//maquina.page' },
    
  ];

  private sub?: Subscription;
  private carouselTimer?: ReturnType<typeof setInterval>;
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregar();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.sub?.unsubscribe();

    this.sub = this.firebaseService.getMaquina().subscribe({
      next: (maquinas) => {
        const total = maquinas.length;
        const criticas = maquinas.filter((m) => !!m.status).length;
        const comLocal = maquinas.filter((m) => !!m.local?.trim()).length;
        const setores = new Set(
          maquinas.map((m) => m.setor).filter((s) => !!s?.trim()),
        ).size;

        this.kicker = `Planta Norte · ${new Date().toLocaleDateString('pt-BR')}`;
        this.stats = [
          { label: 'Máquinas', value: total, link: '//maquina.page', hint: 'Total cadastrado' },
          { label: 'Máquinas Críticas', value: criticas, link: '//maquina.page', hint: 'Prioridade alta' },
          { label: 'Local Máquinas', value: comLocal, link: '//maquina.page', hint: 'Local preenchido' },
          { label: 'Setores', value: setores, link: '//maquina.page', hint: 'Setores distintos' },

        ];

        this.statsCarregados = true;
        this.carregando = false;
        this.slideAtivo = 0;
      },
      error: (err) => {
        this.erro = err instanceof Error ? err.message : 'Falha ao carregar.';
        this.carregando = false;
        this.statsCarregados = true;
      },
    });
  }

  progresso(rota: Rota): number {
    const total = rota.stops?.length ?? 0;
    if (!total) return 0;
    const done = rota.stops.filter((s) => s.concluido).length;
    return Math.round((done / total) * 100);
  }

  doneCount(rota: Rota): number {
    return rota.stops?.filter((s) => s.concluido).length ?? 0;
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
