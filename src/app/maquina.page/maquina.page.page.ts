import { Component, OnInit } from '@angular/core';
import { 
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon
} from '@ionic/angular';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { MockDataService } from '../services/mock-data-service';
import { constructOutline, warningOutline } from 'ionicons/icons';
import {Maquina} from '../models/index';
import { addIcons } from 'ionicons';


@Component({
  standalone: true,
  selector: 'app-maquina.page',
  templateUrl: './maquina.page.page.html',
  styleUrls: ['./maquina.page.page.scss'],
  imports: [ 
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    AppHeaderComponent
  ],
})
export class MaquinaPagePage implements OnInit {
  maquinas: Maquina[] = [];
  expandida: string | null = null;

  constructor(private data: MockDataService) {
    addIcons({ constructOutline, warningOutline });
  }

  ngOnInit(): void {
    this.maquinas = this.data.getMaquinas();
  }

  toggle(id: string): void {
    this.expandida = this.expandida === id ? null : id;
  }
}
