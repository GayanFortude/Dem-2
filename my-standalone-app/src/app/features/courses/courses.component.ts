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
import { Observable } from 'rxjs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { HttpClientJsonpModule } from '@angular/common/http';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { SocketIoModule } from 'ngx-socket-io';
import { NotificationService } from '@progress/kendo-angular-notification';
import { FileDownloadService } from '../../services/FiledownloadService';
import { redoIcon, userIcon, downloadIcon } from '@progress/kendo-svg-icons';
import { ManageCoursesComponent } from './manage-courses/manage-courses.component';
import { CourseServiceGraphql } from '../../services/courseServiceGraphql';

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
  ],
  providers: [CourseServiceGraphql],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  @ViewChild('grid') grid: any;
  constructor(
    private coursegraph: CourseServiceGraphql,
    // private wsService: WebSocketService,
    private notificationService: NotificationService,
    private fileDownloadService: FileDownloadService
  ) {}

  public data: Observable<any[]> = new Observable<Course[]>();

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

  async downloadFile() {
    this.isNewFile = true;
  }

  async onUpload(event: any): Promise<any> {
    if (event.files.length === 0) {
      return;
    }
  }

  public loadMore(reset: boolean = false): void {
    //Loading data to grid
    this.loading = true;
    if (reset) {
      this.data = new Observable<Course[]>();
      this.coursegraph.resetPagination();
      this.data = this.coursegraph.object;
    } else {
      this.data = this.coursegraph.object;
    }
    this.coursegraph.loadMore(this.pageSize, reset).subscribe((d) => {
      this.loading = false;
    });
  }

  public editDataItem: any = {};
  public isNew: boolean = false;

  public addHandler(): void {
    //assign new object
    this.editDataItem = {
      id: null,
      name: null,
    };
    this.isNew = true;
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
    if (course !== null) {
      if (this.isNew == true) {
        //save user
        const newCourse = {
          name: course.name,
        };
        this.coursegraph.createCourse(newCourse).subscribe({
          next: (response) => {
            this.handleNotification(
              'message',
              `Data saved successfully`,
              'success'
            );
            this.loadMore(true);
            window.location.reload()
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
        };
        this.coursegraph.updateCourse(newCourse).subscribe({
          next: async (response) => {
            this.loadMore(true);
            window.location.reload()
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

  public cancelFileHandler(): void {
    this.isNewFile = false;
  }
}
