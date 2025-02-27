import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewEditModalComponent } from './student-view-edit-modal.component';

describe('StudentViewEditModalComponent', () => {
  let component: StudentViewEditModalComponent;
  let fixture: ComponentFixture<StudentViewEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
