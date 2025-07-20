import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionContentsComponent } from './collection-contents.component';

describe('CollectionContentsComponent', () => {
  let component: CollectionContentsComponent;
  let fixture: ComponentFixture<CollectionContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionContentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
