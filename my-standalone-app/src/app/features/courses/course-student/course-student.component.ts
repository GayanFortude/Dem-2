import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Student } from '../../../types/types';
import { cancelIcon, saveIcon, SVGIcon } from '@progress/kendo-svg-icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DateInputsModule,
  KENDO_DATEINPUTS,
} from '@progress/kendo-angular-dateinputs';
import { HttpClientJsonpModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormFieldModule, InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule, KENDO_GRID } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { CourseServiceGraphql } from '../../../services/courseServiceGraphql';
import { LayoutModule } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-course-student',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    DialogModule,
    DateInputsModule,
    LabelModule,
    FormFieldModule,
    ButtonsModule,
    CommonModule,
    HttpClientJsonpModule,
    KENDO_DATEINPUTS,
    KENDO_GRID,
    GridModule,
    LayoutModule,
  ],
  templateUrl: './course-student.component.html',
  styleUrl: './course-student.component.css',
})
export class CourseStudentComponent {
  @Input() public set model(code: string) {
    console.log(this.active);
    if (code != undefined) {
      this.active = true;
      this.viewstudent(code);
    } else {
      this.active = false;
    }
  }
  @Input() public isNew = false;
  @Output() cancel: EventEmitter<undefined> = new EventEmitter();

  public saveIcon: SVGIcon = saveIcon;
  public cancelIcon: SVGIcon = cancelIcon;
  public dateDB: Date = new Date();
  public dateUI: Date = new Date();
  public active = false;
  public loading: boolean = false;
  public data: any;

  constructor(private coursegraph: CourseServiceGraphql) {}

  async viewstudent(code: string): Promise<void> {
    this.coursegraph.getStudentsForCourses(code).subscribe({
      next: (course) => {
        console.log(course);
        this.data = course.student;
        console.log(this.data);
      },
      error: (err) => console.error('Error fetching course data:', err),
    });
    console.log(this.data);
  }

  public onCancel(e: Event): void {
    e.preventDefault();
    this.closeForm();
  }

  public closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }

  ngOnInit() {}
}
