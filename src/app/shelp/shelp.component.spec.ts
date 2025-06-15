import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelpComponent } from './shelp.component';

describe('ShelpComponent', () => {
  let component: ShelpComponent;
  let fixture: ComponentFixture<ShelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
