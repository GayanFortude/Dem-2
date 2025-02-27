import { Injectable, ViewChild } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable, BehaviorSubject, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CREATE_STUDENTS, DELETE_STUDENT, DOWNLOAD_STUDENTS, GET_STUDENTS, UPDATE_STUDENTS } from "../core/graphql.operations";
import { GetStudentResponse, Student } from "../types/types";


@Injectable()
export class StudentServiceGraphql {

  public object: Observable<any[]>;
  private observable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private skip = 0;
  private data: unknown[] = [];
  private completed = false;


  constructor(private apollo: Apollo) {
    this.object = this.observable.asObservable();
  }

  resetPagination(): void { //Reset pagination
    this.skip = 0;  
    this.completed = false; 
    this.data = []; 
    this.observable.next(this.data); 
  }


  loadMore(take: number, reset: boolean): Observable<boolean> { //load grid

    if (this.completed) {
      return from([true]);
    }
    take = 10;
    if (reset) {
      this.skip = 0;
      this.data = []; // Clear old data
      this.observable.next(this.data);
    }
   

    return this.apollo
      .watchQuery<GetStudentResponse>({
        query: GET_STUDENTS,
        fetchPolicy: "network-only",
        variables: { limit: take, offset: this.skip },
      })
      .valueChanges.pipe(
        map((result) => result.data?.getStudent?.student),
        tap((values) => {
          if (values.length === 0) {
            this.completed = true;
          } else {
        
            this.data = [...this.data, ...values]; 
            this.observable.next(this.data);
            this.skip += values.length;
    
          }
        }),
        map((values) => values.length > 0)
      );
  }


  createStudent(studentData: { fname: string; lname: string; email: string; dob: string }): Observable<any> { //post data
    return this.apollo
      .mutate({
        mutation: CREATE_STUDENTS,
        variables: { input: studentData }
      })
      .pipe(map((result: any) => result.data?.CreateStudentInputDto));
  }

  updateStudent(studentData: { id: string, fname: string; lname: string; email: string; dob: string }): Observable<any> { //update data
    return this.apollo
      .mutate({
        mutation: UPDATE_STUDENTS,
        variables: { input: studentData }
      })
      .pipe(map((result: any) => result.data?.updateStudent));
  }

  deleteStudent(id: string) {
    return this.apollo
      .mutate({
        mutation: DELETE_STUDENT,
        variables: { id: id }
      })
      .pipe(map((result: any) => result));
  }

  downloadStudent(age: number,token:string) {
    return this.apollo
      .mutate({
        mutation: DOWNLOAD_STUDENTS,
        variables: { age: age,token:token }
      })
      .pipe(map((result: any) => result));
  }


}
