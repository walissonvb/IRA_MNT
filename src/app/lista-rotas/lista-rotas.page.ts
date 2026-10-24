import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent,  ViewWillEnter } from '@ionic/angular';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { Rota } from '../models';
import { MockDataService } from '../services/mock-data-service';
@Component({
  selector: 'app-lista-rotas',
  templateUrl: './lista-rotas.page.html',
  styleUrls: ['./lista-rotas.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink, AppHeaderComponent],
})
export class ListaRotasPage implements ViewWillEnter {
  rotas: Rota[] = [];

  constructor(private data: MockDataService, private router: Router) {}

  ionViewWillEnter(): void {
    this.rotas = this.data.getRotas();
  }

  doneCount(r: Rota): number {
    return r.stops.filter((s) => s.concluido).length;
  }

  progresso(r: Rota): number {
    if (!r.stops.length) return 0;
    return Math.round((this.doneCount(r) / r.stops.length) * 100);
  }

  rotulo(s: string): string {
    const m: Record<string, string> = {
      planejada: 'Planejada',
      em_execucao: 'Em execução',
      concluida: 'Concluída',
    };
    return m[s] || s;
  }

  abrir(id: string): void {
    void this.router.navigate(['/execucao', id]);
  }
}

