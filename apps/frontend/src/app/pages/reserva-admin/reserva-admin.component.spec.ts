import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaAdminComponent } from './reserva-admin.component';

describe('ReservaAdminComponent', () => {
  let component: ReservaAdminComponent;
  let fixture: ComponentFixture<ReservaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
