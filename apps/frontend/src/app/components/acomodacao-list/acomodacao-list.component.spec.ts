import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcomodacaoListComponent } from './acomodacao-list.component';

describe('AcomodacaoListComponent', () => {
  let component: AcomodacaoListComponent;
  let fixture: ComponentFixture<AcomodacaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcomodacaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcomodacaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
