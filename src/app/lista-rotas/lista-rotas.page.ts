import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonButton
} from '@ionic/angular';

import { AppHeaderComponent } from '../app-header/app-header.component';

import { FirebaseService } from '../services/firebase.service';

import { Rota } from '../models';

@Component({
  selector: 'app-lista-rotas',
  templateUrl: './lista-rotas.page.html',
  styleUrls: ['./lista-rotas.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    RouterLink,
    AppHeaderComponent
  ]
})
export class ListaRotasPage implements OnInit {

  rotas: Rota[] = [];

  carregando = true;

  private firebaseService = inject(FirebaseService);

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {

    this.carregarRotas();

  }

  carregarRotas(): void {

    this.carregando = true;

    this.firebaseService
      .getRotas()
      .subscribe({

        next: (rotas) => {

          console.log(
            '[ROTAS]',
            rotas
          );

          this.rotas = rotas;

          this.carregando = false;

        },

        error: (erro) => {

          console.error(
            '[ROTAS] erro',
            erro
          );

          this.carregando = false;

        }

      });

  }

  doneCount(r: Rota): number {

    return r.stops.filter(
      s => s.concluido
    ).length;

  }

  progresso(r: Rota): number {

    if (!r.stops.length) {
      return 0;
    }

    return Math.round(
      (this.doneCount(r) / r.stops.length) * 100
    );

  }

  rotulo(status: string): string {

    const mapa: Record<string, string> = {

      planejada: 'Planejada',

      em_execucao: 'Em execução',

      concluida: 'Concluída'

    };

    return mapa[status] || status;

  }

  abrir(id: string): void {

    void this.router.navigate([
      '/execucao.page',
      id
    ]);

  }

}