import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdenPagePage } from './orden.page.page';

describe('OrdenPagePage', () => {
  let component: OrdenPagePage;
  let fixture: ComponentFixture<OrdenPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
