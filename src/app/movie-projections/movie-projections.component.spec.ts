import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieProjectionsComponent } from './movie-projections.component';

describe('MovieProjectionsComponent', () => {
  let component: MovieProjectionsComponent;
  let fixture: ComponentFixture<MovieProjectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieProjectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieProjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
