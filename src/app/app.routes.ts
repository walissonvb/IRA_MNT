import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home.page',
    pathMatch: 'full',
  },
  {
    path: 'home.page',
    loadComponent: () => import('./home.page/home.page.page').then( m => m.HomePagePage)
  },
  {
    path: 'almoxerifado.page',
    loadComponent: () => import('./almoxerifado.page/almoxerifado.page.page').then( m => m.AlmoxerifadoPagePage)
  },
  {
    path: 'execucao.page',
    loadComponent: () => import('./execucao.page/execucao.page.page').then( m => m.ExecucaoPagePage)
  },
  {
    path: 'lista-rotas',
    loadComponent: () => import('./lista-rotas/lista-rotas.page').then( m => m.ListaRotasPage)
  },
  {
    path: 'maquina.page',
    loadComponent: () => import('./maquina.page/maquina.page.page').then( m => m.MaquinaPagePage)
  },
  {
    path: 'monitoramento.page',
    loadComponent: () => import('./monitoramento.page/monitoramento.page.page').then( m => m.MonitoramentoPagePage)
  },
  {
    path: 'nova-rota.page',
    loadComponent: () => import('./nova-rota.page/nova-rota.page.page').then( m => m.NovaRotaPagePage)
  },
  {
    path: 'orden.page',
    loadComponent: () => import('./orden.page/orden.page.page').then( m => m.OrdenPagePage)
  },
];
