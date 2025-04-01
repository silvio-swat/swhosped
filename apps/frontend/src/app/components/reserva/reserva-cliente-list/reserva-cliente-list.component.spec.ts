import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaClienteListComponent } from './reserva-cliente-list.component';

describe('ReservaClienteListComponent', () => {
  let component: ReservaClienteListComponent;
  let fixture: ComponentFixture<ReservaClienteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaClienteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaClienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
