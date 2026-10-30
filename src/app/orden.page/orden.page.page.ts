import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../app-header/app-header.component';
import {
  IonSelectOption,
  IonButton,
  IonItem,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonContent,
  IonIcon,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonInput,
  IonSelect,
  IonTextarea,
  IonLabel,
} from "@ionic/angular";

import { MockDataService } from '../services/mock-data-service';
import { OrdemServico } from '../models/index'; 
import { Timestamp } from 'firebase/firestore';
@Component({
  selector: 'app-orden.page',
  templateUrl: './orden.page.page.html',
  styleUrls: ['./orden.page.page.scss'],
  imports: [IonLabel,
    IonSelectOption,
    IonSelect,
    IonTextarea,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonButton,
    CommonModule,
    FormsModule,
    AppHeaderComponent
  ]
})

export class OrdenPagePage implements OnInit {
private dataService = inject(MockDataService);
etapa = 1;
ordemEncontrada: OrdemServico | null = null;
novoStatus: 'pendente' | 'em andamento' | 'concluída' = 'em andamento';
  novaOrdem: Partial<OrdemServico> = {
    setor: '',
    natureza: '',
    prioridade: 'media',
    descricao: '',
    nomeUsuario: '',
    dataFechamento: Timestamp.now(),
    dataAbertura: Timestamp.now(),
    atualizadoPor: Timestamp.now(),



  };



  constructor() { }

  ngOnInit() {
  }
    proximaEtapa() {

    if (!this.novaOrdem.setor || !this.novaOrdem.natureza) {

      alert('Preencha os campos obrigatórios da Etapa 1');
      return;

    }

    this.etapa = 2;

  }


  
}
