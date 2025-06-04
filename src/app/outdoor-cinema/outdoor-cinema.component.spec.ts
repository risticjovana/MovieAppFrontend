import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorCinemaComponent } from './outdoor-cinema.component';

describe('OutdoorCinemaComponent', () => {
  let component: OutdoorCinemaComponent;
  let fixture: ComponentFixture<OutdoorCinemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutdoorCinemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutdoorCinemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
