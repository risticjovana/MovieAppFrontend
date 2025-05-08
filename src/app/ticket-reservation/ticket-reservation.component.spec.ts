import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReservationComponent } from './ticket-reservation.component';

describe('TicketReservationComponent', () => {
  let component: TicketReservationComponent;
  let fixture: ComponentFixture<TicketReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
