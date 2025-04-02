import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaAdminListComponent } from './reserva-admin-list.component';

describe('ReservaAdminListComponent', () => {
  let component: ReservaAdminListComponent;
  let fixture: ComponentFixture<ReservaAdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaAdminListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
