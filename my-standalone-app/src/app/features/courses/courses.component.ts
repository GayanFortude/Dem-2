import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AddEvent,
  GridDataResult,
  GridModule,
  KENDO_GRID,
} from '@progress/kendo-angular-grid';
import { Course } from '../../types/types';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SVGIcon } from '@progress/kendo-svg-icons';
import { State } from '@progress/kendo-data-query';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { Observable, Subject, switchMap, timer } from 'rxjs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { HttpClientJsonpModule } from '@angular/common/http';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { SocketIoModule } from 'ngx-socket-io';
import { NotificationService } from '@progress/kendo-angular-notification';
import { redoIcon, userIcon, downloadIcon ,arrowRotateCwIcon,plusIcon} from '@progress/kendo-svg-icons';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { CourseServiceGraphql } from '../../services/courseServiceGraphql';
import { CourseStudentComponent } from './course-student/course-student.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-courses',
  imports: [
    FormsModule,
    ExcelExportModule,
    KENDO_GRID,
    GridModule,
    CommonModule,
    DialogModule,
    InputsModule,
    LabelModule,
    LayoutModule,
    ButtonsModule,
    ManageCoursesComponent,
    HttpClientJsonpModule,
    UploadsModule,
    SocketIoModule,
    CourseStudentComponent,
    IndicatorsModule
  ],
  providers: [CourseServiceGraphql],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  @ViewChild('grid') grid: any;
  constructor(
    private coursegraph: CourseServiceGraphql,
    private notificationService: NotificationService
  ) {
    this.scrollSubject.pipe(switchMap(() => timer(100))).subscribe(() => {
      this.loadMore(false);
    });
  }

  private scrollSubject = new Subject<void>();
  public data: Observable<any[]> = new Observable<Course[]>();
  public arrowRotateCwIcon: SVGIcon = arrowRotateCwIcon;

  public loading: boolean = false;
  private pageSize = 10;

  public view: Observable<GridDataResult> | undefined;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  isNewFile = false;
  public userIcon: SVGIcon = userIcon;
  public redoIcon: SVGIcon = redoIcon;
  public downloadIcon: SVGIcon = downloadIcon;
 public plusIcon: SVGIcon = plusIcon;

  ngOnInit() {
    this.loadMore();
  }

  private handleNotification(
    event: string,
    message: string,
    type: 'success' | 'error'
  ) {
    this.notificationService.show({
      content: message,
      animation: { type: 'slide', duration: 500 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: type, icon: true },
      hideAfter: 2000,
    });
  }



  async onUpload(event: any): Promise<any> {
    if (event.files.length === 0) {
      return;
    }
  }

  onScrollBottom(): void {
    this.scrollSubject.next();
  }

  public loadMore(reset: boolean = false): void {
    this.loading = true;
    this.data = this.coursegraph.object;
    this.coursegraph.loadMore(this.pageSize, reset).subscribe({
      next: (hasMoreData: boolean) => {
        console.log('Has more data:', hasMoreData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Load more error:', err);
        this.loading = false;
      },
    });
  }

  public editDataItem: any = {};
  public editStudentItem: any = undefined;
  public isNew: boolean = false;

  public addHandler(): void {
    //assign new object
    this.editDataItem = {
      id: null,
      name: null,
    };
    this.isNew = true;
  }
  public viewHandler(args: any): void {
    console.log(args.code)
    this.editStudentItem = args.code;
    this.isNew = false;
  }
  public editHandler(args: AddEvent): void {
    //edit
    this.editDataItem = args.dataItem;
    this.isNew = false;
  }

  onAdd(): void {
    //add
    this.editDataItem = { name: null };
    this.isNew = true;
  }

  public saveHandler(course: Course): void {
    console.log(course);
    if (course !== null) {
      if (this.isNew == true) {
        //save user
        const newCourse = {
          name: course.name,
          code: course.code,
        };
        this.coursegraph.createCourse(newCourse).subscribe({
          next: (response) => {
            this.coursegraph.resetPagination();
            this.loadMore(true);
            this.handleNotification(
              'message',
              `Data saved successfully`,
              'success'
            );
          },
          error: (err) => {
            this.handleNotification(
              'message',
              `Error occcured ${err}`,
              'error'
            );
          },
        });
        this.editDataItem = undefined;
      } else {
        //update user
        const newCourse = {
          id: course.id,
          name: course.name,
          code: course.code,
        };
        this.coursegraph.updateCourse(newCourse).subscribe({
          next: async (response) => {
            console.log(response);
            this.coursegraph.resetPagination();
            this.loadMore(true);
            this.handleNotification(
              'message',
              `Data saved successfully`,
              'success'
            );
          },
          error: (err) => {
            this.handleNotification(
              'message',
              `Error occcured ${err}`,
              'error'
            );
          },
        });

        this.editDataItem = undefined;
      }
    }
  }

  public cancelHandler(): void {
    this.editDataItem = undefined;
  }
  public cancelStudentHandler(): void {
    this.editStudentItem = undefined;
  }

  public cancelFileHandler(): void {
    this.isNewFile = false;
  }
}
