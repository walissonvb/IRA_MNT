import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { MockDataService } from '../services/mock-data-service';
import { ItemAlmoxarifado } from '../models/index';

@Component({
  selector: 'app-almoxerifado.page',
  templateUrl: './almoxerifado.page.page.html',
  styleUrls: ['./almoxerifado.page.page.scss'],
  imports: [IonContent, AppHeaderComponent],
})
export class AlmoxerifadoPagePage implements OnInit {
  itens: ItemAlmoxarifado[] = [];

  constructor(private data: MockDataService) {}

  ngOnInit(): void {
    this.itens = this.data.getAlmoxarifado();
  }

  baixo(i: ItemAlmoxarifado): boolean {
    return i.qtd < i.qtdMinima;
  }

}
