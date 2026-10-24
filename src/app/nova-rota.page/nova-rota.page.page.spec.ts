import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovaRotaPagePage } from './nova-rota.page.page';

describe('NovaRotaPagePage', () => {
  let component: NovaRotaPagePage;
  let fixture: ComponentFixture<NovaRotaPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaRotaPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
