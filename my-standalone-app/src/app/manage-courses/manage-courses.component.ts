import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormFieldModule, InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LabelModule } from '@progress/kendo-angular-label';
import { cancelIcon, saveIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { Course } from '../types/types';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import {
  DateInputsModule,
  KENDO_DATEINPUTS,
} from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CourseServiceGraphql } from '../services/courseServiceGraphql';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-manage-courses',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    DialogModule,
    DateInputsModule,
    LabelModule,
    FormsModule,
    FormFieldModule,
    ButtonsModule,
    CommonModule,
    HttpClientJsonpModule,
    KENDO_DATEINPUTS,
    DropDownsModule,
  ],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css',
})
export class ManageCoursesComponent {
  @Input() public isNew = false;

  @Input() public set model(course: Course) {
    if (course != undefined) {
      if (Object.keys(course).length !== 0) {
        this.active = true;
        this.editForm.get('code')?.disable();
        this.editForm.reset({
          ...course,
        });
        if (course.code) {
          this.editForm.get('code')?.disable();
        } else {
          this.editForm.get('code')?.enable();
        }
      }
    }
  }
  @Output() cancel: EventEmitter<undefined> = new EventEmitter();
  @Output() save: EventEmitter<Course> = new EventEmitter();

  public dateDB: Date = new Date();
  public dateUI: Date = new Date();
  public saveIcon: SVGIcon = saveIcon;
  public cancelIcon: SVGIcon = cancelIcon;
  public active = false;

  public editForm: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    code: new FormControl(),
    Discontinued: new FormControl(false),
  });
  courses: { id: string }[] = [];
  constructor(private courseService: CourseServiceGraphql) {}

  async ngOnInit(): Promise<void> {
    try {
      this.courses = await this.courseService.getAllCourses();
    } catch (error) {
      this.courses = [];
    }
  }

  public onChange(value: Date): void {
    this.dateUI = value; //Catch date change
  }
  public onSave(e: Event): void {
    e.preventDefault();
    this.save.emit(this.editForm.value);
    this.active = false;
  }

  public onCancel(e: Event): void {
    e.preventDefault();
    this.closeForm();
  }

  public closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
}
