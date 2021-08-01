import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBoysRegistrationComponent } from './delivery-boys-registration.component';

describe('DeliveryBoysRegistrationComponent', () => {
  let component: DeliveryBoysRegistrationComponent;
  let fixture: ComponentFixture<DeliveryBoysRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryBoysRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryBoysRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
