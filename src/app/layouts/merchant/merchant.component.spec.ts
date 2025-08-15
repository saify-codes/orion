import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantLayout } from './merchant.component';

describe('MerchantLayout', () => {
  let component: MerchantLayout;
  let fixture: ComponentFixture<MerchantLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
