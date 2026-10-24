import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonHeader,
 } from '@ionic/angular';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { MockDataService } from '../services/mock-data-service';
import { Rota, RotaStop, TecnicaPreditiva, Julgamento } from '../models/index';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  playOutline,
  documentTextOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-execucao.page',
  templateUrl: './execucao.page.page.html',
  styleUrls: ['./execucao.page.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    FormsModule,
    KeyValuePipe,
    RouterLink,
    AppHeaderComponent,
    IonTitle,
    IonToolbar,
    IonHeader,

  ]
})
export class ExecucaoPagePage implements OnInit {
  rota?: Rota;
  tecnicas: TecnicaPreditiva[] = [];
  carregando = true;
  erro = '';

  /** Índice do stop em edição (null = lista) */
  editando: number | null = null;

  /** Valores do formulário de leitura */
  leituras: Record<string, string> = {};
  julgamento: Julgamento = 'normal';
  observacao = '';
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: MockDataService,
  ) {
    addIcons({
      checkmarkCircleOutline,
      playOutline,
      documentTextOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'Rota não informada.';
      this.carregando = false;
      return;
    }
    this.carregar(id);
  }

  carregar(id: string): void {
    this.carregando = true;
    // Em produção: firebase.collection('rotas').doc(id).get()
    this.rota = this.data.getRota(id);
    if (!this.rota) {
      this.erro = 'Rota não encontrada.';
    } else {
      this.tecnicas = this.data
        .getTecnicas()
        .filter((t) => this.rota!.tecnicas.includes(t.id));
    }
    this.carregando = false;
  }

  doneCount(): number {
    return this.rota?.stops.filter((s) => s.concluido).length ?? 0;
  }

  progresso(): number {
    if (!this.rota?.stops.length) return 0;
    return Math.round((this.doneCount() / this.rota.stops.length) * 100);
  }

  abrirStop(ordem: number): void {
    if (!this.rota) return;
    const stop = this.rota.stops.find((s) => s.ordem === ordem);
    if (!stop) return;

    this.editando = ordem;
    this.leituras = {};
    this.julgamento = stop.julgamento || 'normal';
    this.observacao = stop.observacao || '';

    // Pré-preenche se já tiver leitura
    if (stop.leituras) {
      for (const [k, v] of Object.entries(stop.leituras)) {
        this.leituras[k] = String(v);
      }
    }
  }

  fecharStop(): void {
    this.editando = null;
  }

  stopAtual(): RotaStop | undefined {
    if (this.editando == null || !this.rota) return undefined;
    return this.rota.stops.find((s) => s.ordem === this.editando);
  }

  async salvarLeitura(): Promise<void> {
    if (!this.rota || this.editando == null || this.salvando) return;
    this.salvando = true;

    const valores: Record<string, number | string> = {};
    for (const t of this.tecnicas) {
      const v = this.leituras[t.campoPrincipal];
      if (v !== undefined && v !== '') {
        const num = Number(v);
        valores[t.campoPrincipal] = isNaN(num) ? v : num;
      }
    }

    // Em produção: await firebase update
    const atualizada = this.data.atualizarStop(this.rota.id, this.editando, {
      concluido: true,
      leituras: valores,
      julgamento: this.julgamento,
      observacao: this.observacao.trim() || undefined,
    });

    if (atualizada) {
      this.rota = atualizada;
    }

    this.salvando = false;
    this.editando = null;
  }

  /** Continua a partir do próximo não concluído após o atual, ou o primeiro pendente */
  proximoPendente(): void {
    if (!this.rota) return;
    const atual = this.editando ?? 0;
    const prox = this.rota.stops.find(
      (s) => !s.concluido && s.ordem > atual,
    ) || this.rota.stops.find((s) => !s.concluido);

    if (prox) {
      this.abrirStop(prox.ordem);
    } else {
      this.editando = null;
    }
  }

  async salvarEProximo(): Promise<void> {
    const ordemAntes = this.editando;
    await this.salvarLeitura();
    if (ordemAntes != null && this.rota) {
      const prox =
        this.rota.stops.find((s) => !s.concluido && s.ordem > ordemAntes) ||
        this.rota.stops.find((s) => !s.concluido);
      if (prox) this.abrirStop(prox.ordem);
    }
  }

  gerarRelatorio(): void {
    if (!this.rota) return;
    // Gera OS no mesmo modelo de abertura existente
    const criticos = this.rota.stops.filter(
      (s) => s.concluido && (s.julgamento === 'atencao' || s.julgamento === 'critico'),
    );

    if (criticos.length === 0) {
      // Relatório simples — navega para ordens com contexto
      void this.router.navigate(['/ordens'], {
        queryParams: { rotaId: this.rota.id, relatorio: 'ok' },
      });
      return;
    }

    // Cria OS para o primeiro crítico como exemplo
    const stop = criticos[0];
    const desc = `Desvio detectado na ronda "${this.rota.nome}". ` +
      `Julgamento: ${stop.julgamento}. ` +
      (stop.observacao ? `Obs: ${stop.observacao}` : '') +
      (stop.leituras ? ` Leituras: ${JSON.stringify(stop.leituras)}` : '');

    this.data.criarOrdemDeRota(this.rota.id, stop, desc);
    void this.router.navigate(['/ordens']);
  }

  rotuloStatus(s: string): string {
    const map: Record<string, string> = {
      planejada: 'Planejada',
      em_execucao: 'Em execução',
      concluida: 'Concluída',
    };
    return map[s] || s;
  }
}
