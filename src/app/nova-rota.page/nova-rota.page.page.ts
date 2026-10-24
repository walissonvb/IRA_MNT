import { Component, OnInit } from '@angular/core';
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
import  {MockDataService} from '../services/mock-data-service';
import {
  TecnicaPreditiva,
  Maquina,
  Equipe,
  RotaStop,
} from '../models';


@Component({
  selector: 'app-nova-rota.page',
  templateUrl: './nova-rota.page.page.html',
  styleUrls: ['./nova-rota.page.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, FormsModule, AppHeaderComponent],
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

  constructor(
    private data: MockDataService,
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

  ngOnInit(): void {
    this.tecnicas = this.data.getTecnicas();
    this.equipes = this.data.getEquipes();
    this.maquinas = this.data.getMaquinas();
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

  async salvar(): Promise<void> {
    if (!this.podeAvancar() || this.salvando) return;
    this.salvando = true;
    this.erro = '';

    try {
      const equipe = this.equipes.find((e) => e.id === this.equipeId);
      const stops: RotaStop[] = this.ordem.map((m, i) => ({
        maquinaId: m.id,
        tag: m.tag,
        nome: m.nome,
        ordem: i + 1,
        concluido: false,
      }));

      const rota = this.data.salvarRota({
        nome: this.nomeRota.trim(),
        tecnicas: [...this.selecionadas],
        equipeId: this.equipeId,
        equipeNome: equipe?.nome,
        status: 'planejada',
        stops,
      });

      // Em produção: await firebase.collection('rotas').add(...)
      void this.router.navigate(['/execucao', rota.id]);
    } catch (e) {
      this.erro = e instanceof Error ? e.message : 'Erro ao salvar rota.';
    } finally {
      this.salvando = false;
    }
  }
}
