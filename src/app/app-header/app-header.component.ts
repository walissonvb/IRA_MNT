import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  gridOutline,
  gitNetworkOutline,
  checkboxOutline,
  documentTextOutline,
  settingsOutline,
  constructOutline,
  cubeOutline,
  pulseOutline,
  listOutline,
} from 'ionicons/icons';
import { NavItem } from '../models';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonIcon, RouterLink],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  /** Subtítulo da marca (ex: Planta Norte) */
  @Input() planta = 'PCM · Planta Norte';

  /** Itens de navegação. Se vazio, usa o padrão do app. */
  @Input() nav: NavItem[] = [];

  private sub?: Subscription;

  private readonly navPadrao: NavItem[] = [
    { path: '/home.page', label: 'Painel', icon: 'grid-outline', exact: true },
    { path: '/nova-rota.page', label: 'Nova rota', icon: 'git-network-outline' },
    { path: '/lista-rotas', label: 'Executar', icon: 'checkbox-outline' },
    { path: '/maquina.page', label: 'Máquinas', icon: 'construct-outline' },
    { path: '/orden.page', label: 'Ordens', icon: 'document-text-outline' },
    { path: '/almoxerifado.page', label: 'Almox', icon: 'cube-outline' },
    { path: '/monitoramento.page', label: 'Monitor', icon: 'pulse-outline' },
  ];

  constructor(private router: Router) {
    addIcons({
      gridOutline,
      gitNetworkOutline,
      checkboxOutline,
      documentTextOutline,
      settingsOutline,
      constructOutline,
      cubeOutline,
      pulseOutline,
      listOutline,
    });
  }

  ngOnInit(): void {
    if (!this.nav.length) {
      this.nav = [...this.navPadrao];
    }
    this.atualizarAbaAtiva();
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.atualizarAbaAtiva());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private atualizarAbaAtiva(): void {
    const url = this.router.url.split('?')[0];
    this.nav = this.nav.map((item) => ({
      ...item,
      ativo: item.exact
        ? url === item.path || url === '/' || url === '/home'
        : url === item.path || url.startsWith(item.path + '/'),
    }));
  }

  abrirConfig(): void {
    void this.router.navigateByUrl('/config');
  }
}
