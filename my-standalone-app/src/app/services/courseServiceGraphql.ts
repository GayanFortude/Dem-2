import { Injectable, ViewChild } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CREATE_COURSES,
  CREATE_STUDENTS,
  DELETE_STUDENT,
  DOWNLOAD_STUDENTS,
  GET_ALL_COURSES,
  GET_COURSES,
  GET_STUDENTS,
  UPDATE_COURSES,
  UPDATE_STUDENTS,
} from '../core/graphql.operations';
import { GetStudentResponse, Student } from '../types/types';

@Injectable()
export class CourseServiceGraphql {
  public object: Observable<any[]>;
  private observable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private skip = 0;
  private data: unknown[] = [];
  private completed = false;

  constructor(private apollo: Apollo) {
    this.object = this.observable.asObservable();
  }
  public loading = false;
  resetPagination(): void {
    //Reset pagination
    this.skip = 0;
    this.completed = false;
    this.data = [];
    // this.observable.next(this.data);
  }

  loadMore(take: number, reset: boolean): Observable<boolean> {
    if (this.completed) {
      return from([true]);
    }
    console.log(take,reset)
    if (reset) {
      // console.log(reset)
      // this.skip = 0;
      // this.data = [];
      // this.observable.next(this.data);
    }

    this.loading = true; // Show loading spinner in grid

    return this.apollo
      .watchQuery<any>({
        query: GET_COURSES,
        fetchPolicy: "network-only",
        variables: { limit: take, offset: this.skip },
      })
      .valueChanges.pipe(
        map((result) => result?.data?.getCourses || []),
        tap((values) => {
          console.log(values,values.length)
          if (values.length === 0 ) {
            this.completed = true;console.log("values")
          } 
          else {
            if (reset) {
              console.log(reset)
              this.resetPagination()
            }
            console.log(values)
            this.data = [...this.data, ...values];
            this.observable.next(this.data);
            this.skip += values.length;
            console.log(this.data)
          }
          
        }),
        map((values) => values.length > 0)
      );
  }


  
    async getAllCourses(): Promise<{ id: string }[]> {
      const result = await this.apollo
        .query<{ getAllCourses: { id: string }[] }>({
          query: GET_ALL_COURSES,
        })
        .toPromise(); 
  
      return result?.data?.getAllCourses || [];
    }
  

  createCourse(courseData: { name: string }): Observable<any> {
    console.log(courseData);
    return this.apollo
      .mutate({
        mutation: CREATE_COURSES, // Note: Typo? Should be CREATE_COURSE?
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.input));
  }

  updateCourse(courseData: {
    name: string;
  }): Observable<any> {
    //update data
    return this.apollo
      .mutate({
        mutation: UPDATE_COURSES,
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.UpdateCourseInput));
  }

  // deleteStudent(id: string) {
  //   return this.apollo
  //     .mutate({
  //       mutation: DELETE_STUDENT,
  //       variables: { id: id },
  //     })
  //     .pipe(map((result: any) => result));
  // }

  // downloadStudent(age: number, token: string) {
  //   return this.apollo
  //     .mutate({
  //       mutation: DOWNLOAD_STUDENTS,
  //       variables: { age: age, token: token },
  //     })
  //     .pipe(map((result: any) => result));
  // }
}
