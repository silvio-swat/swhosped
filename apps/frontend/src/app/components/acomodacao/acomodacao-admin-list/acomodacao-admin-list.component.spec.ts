import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcomodacaoAdminListComponent } from './acomodacao-admin-list.component';

describe('AcomodacaoAdminListComponent', () => {
  let component: AcomodacaoAdminListComponent;
  let fixture: ComponentFixture<AcomodacaoAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcomodacaoAdminListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcomodacaoAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
