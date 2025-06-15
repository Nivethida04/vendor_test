import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDeliveriesComponent } from './list-of-deliveries.component';

describe('ListOfDeliveriesComponent', () => {
  let component: ListOfDeliveriesComponent;
  let fixture: ComponentFixture<ListOfDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfDeliveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
