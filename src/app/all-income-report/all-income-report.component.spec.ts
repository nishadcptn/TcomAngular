import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncomeReportComponent } from './all-income-report.component';

describe('AllIncomeReportComponent', () => {
  let component: AllIncomeReportComponent;
  let fixture: ComponentFixture<AllIncomeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIncomeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncomeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
