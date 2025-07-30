import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsCollectionsComponent } from './editors-collections.component';

describe('EditorsCollectionsComponent', () => {
  let component: EditorsCollectionsComponent;
  let fixture: ComponentFixture<EditorsCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorsCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorsCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
