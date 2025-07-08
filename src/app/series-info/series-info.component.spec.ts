import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesInfoComponent } from './series-info.component';

describe('SeriesInfoComponent', () => {
  let component: SeriesInfoComponent;
  let fixture: ComponentFixture<SeriesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
