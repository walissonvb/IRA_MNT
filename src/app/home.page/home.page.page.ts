import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonButton, IonSpinner } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { DashboardAlerta, Rota, Maquina, StatCard } from '../models/index';
import { AppHeaderComponent } from '../app-header/app-header.component';

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
  imports: [IonContent, IonButton, IonSpinner, RouterLink, AppHeaderComponent],
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
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.carregar();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.pararCarousel();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.sub?.unsubscribe();
    this.pararCarousel();

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
          { label: 'Críticas', value: criticas, link: '//maquina.page', hint: 'Prioridade alta' },
          { label: 'Com local', value: comLocal, link: '//maquina.page', hint: 'Local preenchido' },
          { label: 'Setores', value: setores, link: '//maquina.page', hint: 'Setores distintos' },
        ];

        this.statsCarregados = true;
        this.carregando = false;
        this.slideAtivo = 0;
        this.iniciarCarousel();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.erro = err instanceof Error ? err.message : 'Falha ao carregar.';
        this.carregando = false;
        this.statsCarregados = true;
        this.cdr.markForCheck();
      },
    });
  }

  iniciarCarousel(): void {
    this.pararCarousel();
    if (this.stats.length <= 1) return;
    this.carouselTimer = setInterval(() => {
      this.slideAtivo = (this.slideAtivo + 1) % this.stats.length;
      this.cdr.markForCheck();
    }, 5000);
  }


pararCarousel(): void {
  if (this.carouselTimer) {
    clearInterval(this.carouselTimer);
    this.carouselTimer = undefined;
  }
}

pausarCarousel(): void {
  this.pararCarousel();
}

retomarCarousel(): void {
  this.iniciarCarousel();
}

irParaSlide(index: number): void {
  this.slideAtivo = index;
  this.iniciarCarousel(); // reinicia a contagem de 5 s
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
