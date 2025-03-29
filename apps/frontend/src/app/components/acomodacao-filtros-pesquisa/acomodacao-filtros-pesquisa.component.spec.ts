import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcomodacaoFiltrosPesquisaComponent } from './acomodacao-filtros-pesquisa.component';

describe('AcomodacaoFiltrosPesquisaComponent', () => {
  let component: AcomodacaoFiltrosPesquisaComponent;
  let fixture: ComponentFixture<AcomodacaoFiltrosPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcomodacaoFiltrosPesquisaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcomodacaoFiltrosPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
