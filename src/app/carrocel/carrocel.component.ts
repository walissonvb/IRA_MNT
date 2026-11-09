import { Component, OnInit, Input, inject, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { StatCard } from '../models/index';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonSpinner, IonCard } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-carrocel',
  templateUrl: './carrocel.component.html',
  styleUrls: ['./carrocel.component.scss'],
  imports: [IonCard, IonContent, IonButton, IonSpinner, CommonModule],
})
export class CarrocelComponent implements OnInit, OnDestroy, OnChanges  {
  @Input() carregando = false;
  @Input() statsCarregados = false;
  @Input() stats: StatCard[] = [];
  slideAtivo = 0;

  private carouselTimer?: ReturnType<typeof setInterval>;

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.pararCarousel();
  }
  ngOnChanges(): void {
    if (this.stats?.length) {
      this.iniciarCarousel();
    }
  }
constructor(
  private router: Router,
  private cdr: ChangeDetectorRef
) {}
  abrir(link?: string) {
    if (link) {
      this.router.navigateByUrl(link);
    }
  }

  // Se quiser controlar o carrossel depois
  setSlide(index: number) {
    this.slideAtivo = index;
  }
  pararCarousel(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = undefined;
    }
  }
  pausarCarousel(): void {
    this.pararCarousel();
  }
  retomarCarousel(): void {
    this.iniciarCarousel();
  }
  irParaSlide(index: number): void {
    this.slideAtivo = index;
    this.iniciarCarousel(); // reinicia a contagem de 5 s
  }
  iniciarCarousel(): void {
    this.pararCarousel();
    if (this.stats.length <= 1) return;
    this.carouselTimer = setInterval(() => {
      this.slideAtivo = (this.slideAtivo + 1) % this.stats.length;
      this.cdr.markForCheck();
    }, 5000);
  }

}
