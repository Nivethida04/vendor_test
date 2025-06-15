import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayageComponent } from './payage.component';

describe('PayageComponent', () => {
  let component: PayageComponent;
  let fixture: ComponentFixture<PayageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
