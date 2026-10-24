import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoramentoPagePage } from './monitoramento.page.page';

describe('MonitoramentoPagePage', () => {
  let component: MonitoramentoPagePage;
  let fixture: ComponentFixture<MonitoramentoPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoramentoPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
