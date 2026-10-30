import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
    thermometerOutline,
  pulseOutline,
  waterOutline,
  eyeOutline,
  constructOutline,
} from 'ionicons/icons';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { MockDataService } from '../services/mock-data-service';
import { TecnicaPreditiva, Maquina } from '../models/index';


@Component({
  selector: 'app-monitoramento.page',
  templateUrl: './monitoramento.page.page.html',
  styleUrls: ['./monitoramento.page.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, AppHeaderComponent]
})
export class MonitoramentoPagePage implements OnInit {
  tecnicas: TecnicaPreditiva[] = [];
  maquinas: Maquina[] = [];

  constructor(private data: MockDataService) {
    addIcons({
      thermometerOutline,
      pulseOutline,
      waterOutline,
      eyeOutline,
      constructOutline,
    });
  }

  ngOnInit(): void {
    this.tecnicas = this.data.getTecnicas();
    this.maquinas = this.data.getMaquinas();
  }
}
