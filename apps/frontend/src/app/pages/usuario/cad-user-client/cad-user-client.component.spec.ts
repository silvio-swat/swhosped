import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadUserClientComponent } from './cad-user-client.component';

describe('CadUserClientComponent', () => {
  let component: CadUserClientComponent;
  let fixture: ComponentFixture<CadUserClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadUserClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadUserClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
