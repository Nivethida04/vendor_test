import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceSheetComponent } from './finance-sheet.component';

describe('FinanceSheetComponent', () => {
  let component: FinanceSheetComponent;
  let fixture: ComponentFixture<FinanceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
