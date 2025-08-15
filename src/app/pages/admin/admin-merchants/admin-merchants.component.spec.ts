import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMerchantsComponent } from './admin-merchants.component';

describe('AdminMerchantsComponent', () => {
  let component: AdminMerchantsComponent;
  let fixture: ComponentFixture<AdminMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMerchantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
