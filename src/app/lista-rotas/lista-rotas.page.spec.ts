import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaRotasPage } from './lista-rotas.page';

describe('ListaRotasPage', () => {
  let component: ListaRotasPage;
  let fixture: ComponentFixture<ListaRotasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
