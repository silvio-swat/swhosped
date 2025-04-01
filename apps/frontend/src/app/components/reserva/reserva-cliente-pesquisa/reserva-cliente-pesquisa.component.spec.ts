import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaClientePesquisaComponent } from './reserva-cliente-pesquisa.component';

describe('ReservaClientePesquisaComponent', () => {
  let component: ReservaClientePesquisaComponent;
  let fixture: ComponentFixture<ReservaClientePesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaClientePesquisaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaClientePesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
