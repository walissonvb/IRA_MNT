import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  thermometerOutline,
  pulseOutline,
  waterOutline,
  flashOutline,
  speedometerOutline,
  analyticsOutline,
  eyeOutline,
  constructOutline,
  radioOutline,
  gitCompareOutline,
  checkmarkOutline,
  chevronForwardOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { FirebaseService } from '../services/firebase.service';
import {
  TecnicaPreditiva,
  Maquina,
  Equipe,
  RotaStop,
} from '../models';
import { MachineCardComponent } from '../machine-card/machine-card.component';

@Component({
  selector: 'app-nova-rota.page',
  templateUrl: './nova-rota.page.page.html',
  styleUrls: ['./nova-rota.page.page.scss'],
  standalone: true,
  imports: [MachineCardComponent, IonContent, IonButton, IonIcon, FormsModule, AppHeaderComponent],
})
export class NovaRotaPagePage implements OnInit {

  passo = 1; // 1=técnicas, 2=equipe, 3=equipamentos, 4=revisar

  tecnicas: TecnicaPreditiva[] = [];
  selecionadas = new Set<string>();

  equipes: Equipe[] = [];
  equipeId = '';

  maquinas: Maquina[] = [];
  /** Ordem crescente dos equipamentos escolhidos */
  ordem: Maquina[] = [];

  nomeRota = '';
  salvando = false;
  erro = '';

  
  private firebaseService = inject(FirebaseService);
  constructor(
    private router: Router,
  ) {
    addIcons({
      thermometerOutline,
      pulseOutline,
      waterOutline,
      flashOutline,
      speedometerOutline,
      analyticsOutline,
      eyeOutline,
      constructOutline,
      radioOutline,
      gitCompareOutline,
      checkmarkOutline,
      chevronForwardOutline,
      chevronBackOutline,
    });
  }
tecnicasPorMaquina:
Record<string, string[]> = {};

anomaliasPorMaquina:
Record<
  string,
  Record<string,string[]>
> = {};

async ngOnInit(): Promise<void> {

  await Promise.all([
    this.carregarTecnicas(),
    this.carregarEquipes(),
    this.carregarMaquinas()
  ]);
}
async carregarTecnicas(): Promise<void> {

  this.firebaseService
    .getTecnicas()
    .subscribe({

      next: (dados) => {

        console.log(
          '[TECNICAS]',
          dados
        );

        this.tecnicas = dados
          .filter(
            t => t.ativo !== false
          )
          .sort(
            (a, b) =>
              (a.ordem ?? 0) -
              (b.ordem ?? 0)
          );

      },

      error: (err) => {

        console.error(
          '[TECNICAS]',
          err
        );

      }

    });

}

async carregarEquipes(): Promise<void> {

  this.firebaseService
    .getEquipes()
    .subscribe({

      next: (dados) => {

        console.log(
          '[EQUIPES]',
          dados
        );

        this.equipes = dados.filter(
          e => e.ativa !== false
        );

      }

    });

}

async carregarMaquinas(): Promise<void> {

  this.firebaseService
    .getMaquina()
    .subscribe({

      next: (dados) => {

        console.log(
          '[MAQUINAS]',
          dados
        );

        this.maquinas = dados.filter(
          m => m.ativa !== false
        );

      }

    });

}

async salvar(): Promise<void> {

  if (
    !this.podeAvancar() ||
    this.salvando
  ) {
    return;
  }

  this.salvando = true;

  try {

    const equipe = this.equipes.find(
      e => e.id === this.equipeId
    );

const stops: RotaStop[] =
  this.ordem.map(
    (m, index) => {

      const tecnicasDaMaquina =
        this.tecnicasPorMaquina[m.id] || [];

      return {

        maquinaId: m.id,

        tag: m.tag,

        nome: m.nome,

        ordem: index + 1,

        concluido: false,

        tecnicas: tecnicasDaMaquina

      };

    }
  );
    const rotaId =
      await this.firebaseService
        .salvarRota({

          nome:
            this.nomeRota.trim(),

          equipeId:
            this.equipeId,

          equipeNome:
            equipe?.nome,

          tecnicas:
            [...this.selecionadas],

          stops,

          status:
            'planejada'

        });

    console.log(
      '[ROTA SALVA]',
      rotaId
    );

    await this.router.navigate([
      '/execucao',
      rotaId
    ]);

  } catch (erro) {

    console.error(
      '[SALVAR ROTA]',
      erro
    );

    this.erro =
      'Erro ao salvar a rota';

  } finally {

    this.salvando = false;

  }

}
  toggleTecnica(id: string): void {
    if (this.selecionadas.has(id)) {
      this.selecionadas.delete(id);
    } else {
      this.selecionadas.add(id);
    }
    this.selecionadas = new Set(this.selecionadas);
  }

  isSelecionada(id: string): boolean {
    return this.selecionadas.has(id);
  }

  podeAvancar(): boolean {
    if (this.passo === 1) return this.selecionadas.size > 0;
    if (this.passo === 2) return !!this.equipeId;
    if (this.passo === 3) return this.ordem.length > 0;
    if (this.passo === 4) return this.nomeRota.trim().length > 2;
    return false;
  }

  avancar(): void {
    if (!this.podeAvancar()) return;
    if (this.passo < 4) {
      this.passo++;
      if (this.passo === 4 && !this.nomeRota) {
        this.nomeRota = this.sugerirNome();
      }
    } else {
      void this.salvar();
    }
  }

  voltar(): void {
    if (this.passo > 1) this.passo--;
  }

  selecionarEquipe(id: string): void {
    this.equipeId = id;
  }

  toggleMaquina(m: Maquina): void {
    const idx = this.ordem.findIndex((x) => x.id === m.id);
    if (idx >= 0) {
      this.ordem.splice(idx, 1);
    } else {
      this.ordem.push(m);
    }
    this.ordem = [...this.ordem];
  }

  posicao(m: Maquina): number {
    return this.ordem.findIndex((x) => x.id === m.id) + 1;
  }

  mover(idx: number, dir: -1 | 1): void {
    const novo = idx + dir;
    if (novo < 0 || novo >= this.ordem.length) return;
    const arr = [...this.ordem];
    [arr[idx], arr[novo]] = [arr[novo], arr[idx]];
    this.ordem = arr;
  }

  nomeEquipe(): string {
    return this.equipes.find((e) => e.id === this.equipeId)?.nome || '—';
  }

  private sugerirNome(): string {
    const nomes = [...this.selecionadas]
      .map((id) => this.tecnicas.find((t) => t.id === id)?.nome)
      .filter(Boolean)
      .slice(0, 2)
      .join(' + ');
    return `Rota ${nomes || 'preditiva'}`;
  }

toggleTecnicaMaquina(
  event: {
    maquinaId: string;
    tecnicaId: string;
  }
): void {

  const {
    maquinaId,
    tecnicaId
  } = event;

  if (!this.tecnicasPorMaquina[maquinaId]) {

    this.tecnicasPorMaquina[
      maquinaId
    ] = [];

  }

  const lista =
    this.tecnicasPorMaquina[
      maquinaId
    ];

  const idx =
    lista.indexOf(tecnicaId);

  if (idx >= 0) {

    lista.splice(idx, 1);

  } else {

    lista.push(tecnicaId);

  }

}

toggleAnomaliaMaquina(
  event: {
    maquinaId: string;
    tecnicaId: string;
    anomalia: string;
  }
): void {

  const {
    maquinaId,
    tecnicaId,
    anomalia
  } = event;

  this.anomaliasPorMaquina[maquinaId] ??= {};

  this.anomaliasPorMaquina[
    maquinaId
  ][tecnicaId] ??= [];

  const lista =
    this.anomaliasPorMaquina[
      maquinaId
    ][tecnicaId];

  const idx =
    lista.indexOf(anomalia);

  if (idx >= 0) {

    lista.splice(idx, 1);

  } else {

    lista.push(anomalia);

  }

}

}
