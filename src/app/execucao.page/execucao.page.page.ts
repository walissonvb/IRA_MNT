import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { Rota, RotaStop, TecnicaPreditiva } from '../models/index';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  playOutline,
  documentTextOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';

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
  anomaliasEncontradas:
    Record<string, string[]> = {};

  observacoesTecnica:
    Record<string, string> = {};

  rota: Rota | null = null;
  tecnicas: TecnicaPreditiva[] = [];
  carregando = true;
  erro = '';

  /** Índice do stop em edição (null = lista) */
  editando: number | null = null;

  /** Valores do formulário de leitura */
  leituras: Record<string, any> = {};

  salvando = false;
  private firebase = inject(FirebaseService);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  isAnomaliaSelecionada(
    tecnicaId: string,
    anomalia: string
  ): boolean {

    return (
      this.anomaliasEncontradas[
      tecnicaId
      ] || []
    ).includes(anomalia);

  }

  toggleAnomalia(
    tecnicaId: string,
    anomalia: string
  ): void {

    this.anomaliasEncontradas[
      tecnicaId
    ] ??= [];

    const lista =
      this.anomaliasEncontradas[
      tecnicaId
      ];

    const idx =
      lista.indexOf(anomalia);

    if (idx >= 0) {

      lista.splice(idx, 1);

    } else {

      lista.push(anomalia);

    }

  }
  async carregar(id: string): Promise<void> {

    this.carregando = true;

    try {

      this.rota = await this.firebase.getRota(id);

      console.log('[EXECUCAO] rota:', this.rota);

      if (!this.rota) {
        this.erro = 'Rota não encontrada.';
        return;
      }


    } catch (erro) {

      console.error(
        '[EXECUCAO] erro carregar rota',
        erro
      );

      this.erro = 'Erro ao carregar rota';

    } finally {

      this.carregando = false;

    }
  }

  doneCount(): number {
    return this.rota?.stops.filter((s) => s.concluido).length ?? 0;
  }

  progresso(): number {
    if (!this.rota?.stops.length) return 0;
    return Math.round((this.doneCount() / this.rota.stops.length) * 100);
  }

  abrirStop(ordem: number): void {

    if (!this.rota) {
      return;
    }

    const stop =
      this.rota.stops.find(
        s => s.ordem === ordem
      );

    if (!stop) {
      return;
    }

    this.editando = ordem;

    this.leituras = {};

    this.anomaliasEncontradas = {};


  }
  fecharStop(): void {
    this.editando = null;
  }

  stopAtual(): RotaStop | undefined {
    if (this.editando == null || !this.rota) return undefined;
    return this.rota.stops.find((s) => s.ordem === this.editando);
  }

  async salvarLeitura(): Promise<void> {

    if (
      !this.rota ||
      this.editando == null ||
      this.salvando
    ) {
      return;
    }

    this.salvando = true;

    try {

      const stop = this.stopAtual();

      if (!stop) {
        return;
      }

      const payload = {

        rotaId: this.rota.id,

        maquinaId: stop.maquinaId,

        maquinaNome: stop.nome,

        leituras: this.leituras,

        anomaliasEncontradas:
          this.anomaliasEncontradas

      };

      console.log(
        '[LEITURA]',
        payload
      );

      this.editando = null;

    } finally {

      this.salvando = false;

    }

  }  /** Continua a partir do próximo não concluído após o atual, ou o primeiro pendente */
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

    if (!this.rota) {
      return;
    }

    void this.router.navigate([
      '/ordens'
    ], {
      queryParams: {
        rotaId: this.rota.id
      }
    });

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
