import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaAdminPesquisaComponent } from './reserva-admin-pesquisa.component';

describe('ReservaAdminPesquisaComponent', () => {
  let component: ReservaAdminPesquisaComponent;
  let fixture: ComponentFixture<ReservaAdminPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaAdminPesquisaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaAdminPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
