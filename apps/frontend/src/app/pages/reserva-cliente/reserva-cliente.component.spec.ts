import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaClienteComponent } from './reserva-cliente.component';

describe('ReservaClienteComponent', () => {
  let component: ReservaClienteComponent;
  let fixture: ComponentFixture<ReservaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
