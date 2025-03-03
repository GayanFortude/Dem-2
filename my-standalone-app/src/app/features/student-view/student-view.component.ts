import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AddEvent,
  FilterableSettings,
  GridDataResult,
  GridModule,
  KENDO_GRID,
  RemoveEvent,
} from '@progress/kendo-angular-grid';
import { Student } from '../../types/types';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SVGIcon } from '@progress/kendo-svg-icons';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { Observable } from 'rxjs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { HttpClientJsonpModule } from '@angular/common/http';
import { StudentViewEditModalComponent } from './student-view-edit-modal/student-view-edit-modal.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { StudentServiceGraphql } from '../../services/studentServiceGraphql';
import { WebSocketService } from '../../services/webShocket.service';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environment';
import { NotificationService } from '@progress/kendo-angular-notification';
import { FileDownloadService } from '../../services/FiledownloadService';
import { redoIcon, userIcon, downloadIcon } from '@progress/kendo-svg-icons';
import { FiledownloadComponent } from './filedownload/filedownload.component';
import { CourseServiceGraphql } from '../../services/courseServiceGraphql';

@Component({
  selector: 'app-student-view',
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
    StudentViewEditModalComponent,
    FiledownloadComponent,
    HttpClientJsonpModule,
    UploadsModule,
    SocketIoModule,
  ],
  templateUrl: './student-view.component.html',
  providers: [StudentServiceGraphql,CourseServiceGraphql],
  styleUrl: './student-view.component.css',
})
export class StudentViewComponent {
  @ViewChild('grid') grid: any;
  constructor(
    private studentgraph: StudentServiceGraphql,
    private wsService: WebSocketService,
    private notificationService: NotificationService,
    private fileDownloadService: FileDownloadService
  ) {}

  public data: Observable<Student[]> = new Observable<Student[]>();

  public loading: boolean = false;
  private pageSize = 10;
  fileuploadEndpoint = `${environment.fileUploadendpoint}/upload`;
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

    this.wsService.listen().subscribe((d) => {

      const parsedData = JSON.parse(d);
      const { event, data } = parsedData;
      const { message, filePath, userId, type, timestamp } = data;

      this.handleNotification('message', message, type);
      if (filePath != null) {
        this.fileDownloadService.downloadFile(filePath);
      }
    });
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

  ngOnDestroy() {
     this.wsService.disconnect();
  }

  async onUpload(event: any): Promise<any> {
    if (event.files.length === 0) {
      return;
    }

    const file = event.files[0].rawFile;
    const formData = new FormData();
    formData.append('file', file);
    document.cookie = 'token=user1; path=/;';
    try {
      const response = await fetch(this.fileuploadEndpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();
        this.handleNotification(
          'message',
          `File saved successfully`,
          'success'
        );
      } else {
        const errorText = await response.text();
        this.handleNotification(
          'message',
          `n error occurred during file upload`,
          'error'
        );
      }
    } catch (error) {
      this.handleNotification(
        'message',
        `n error occurred during file upload ${error}`,
        'error'
      );
    }
    event.preventDefault();
  }

  public loadMore(reset: boolean = false): void {
    //Loading data to grid
    this.loading = true;
    if (reset) {
      console.log("ddd")
      this.data = new Observable<Student[]>();
      this.studentgraph.resetPagination();
      this.data = this.studentgraph.object;
    } else {
      this.data = this.studentgraph.object;
    }
    this.studentgraph.loadMore(this.pageSize, reset).subscribe((d) => {
      this.loading = false;
    });
  }

  public editDataItem: any = {};
  public isNew: boolean = false;

  public addHandler(): void {
    //assign new object
    this.editDataItem = {
      id: null,
      fname: null,
      lname: null,
      email: '',
      dob: null,
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
    this.editDataItem = { dob: null, email: '', fname: null, lname: null ,courseId:null};
    this.isNew = true;
  }

  public removeHandler(args: RemoveEvent): void {
    this.studentgraph.deleteStudent(args.dataItem.id).subscribe({
      next: (response) => {
        if (response) {
          this.handleNotification(
            'message',
            `Data deleted successfully`,
            'success'
          );
          this.loadMore(true);
        }
      },
      error: (err) => {
        this.handleNotification('message', `Error creating user`, 'error');
      },
    });
  }

  public async saveFileHandler(data: any) {
 
    try {
      this.studentgraph
        .downloadStudent(parseInt(data.age), 'token=user1')
        .subscribe({
          next: (response) => {
            if (response) {
              this.handleNotification('message', `Data Processing`, 'success');
              // this.loadMore(true);
            }
          },
          error: (err) => {
            this.handleNotification(
              'message',
              `Error downloading user`,
              'error'
            );
          },
        });
    } catch (error) {
      this.handleNotification(
        'excel-error',
        `Error occurred: ${error}`,
        'error'
      );
    }
    this.isNewFile = false;
  }

  public saveHandler(student: Student): void {
    if (student !== null) {
      if (this.isNew == true) {
        //save user
        const formattedDate = this.formatDate(student.dob);
        const newStudent = {
          fname: student.fname,
          lname: student.lname,
          email: student.email,
          courseID:"",
          dob: formattedDate.toString(),
        };
        this.studentgraph.createStudent(newStudent).subscribe({
          next: (response) => {
            this.handleNotification(
              'message',
              `Data saved successfully`,
              'success'
            );
            this.data = new Observable<Student[]>();
            this.loadMore(true);
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
        const formattedDate = this.formatDate(student.dob);
        const newStudent = {
          id: student.id,
          fname: student.fname,
          lname: student.lname,
          email: student.email,
          courseID:student.courseID,
          dob: formattedDate.toString(),
        };
        this.data = new Observable<Student[]>();
        // this.studentgraph.resetPagination();
         this.loadMore(true);
        this.studentgraph.updateStudent(newStudent).subscribe({
          next: async (response) => {
            this.handleNotification(
              'message',
              `Data saved successfully`,
              'success'
            );
            console.log("ddd")
  
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

  private formatDate(date: string | Date): string {
    //date format
    const convertDate = new Date(date);
    const year = convertDate.getFullYear();
    const month = String(convertDate.getMonth() + 1).padStart(2, '0');
    const day = String(convertDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public cancelHandler(): void {
    this.editDataItem = undefined;
  }

  public cancelFileHandler(): void {
    this.isNewFile = false;
  }

}
