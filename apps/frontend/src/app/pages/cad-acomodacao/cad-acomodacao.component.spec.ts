import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadAcomodacaoComponent } from './cad-acomodacao.component';

describe('CadAcomodacaoComponent', () => {
  let component: CadAcomodacaoComponent;
  let fixture: ComponentFixture<CadAcomodacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadAcomodacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadAcomodacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
