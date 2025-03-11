import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject, from, lastValueFrom } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import {
  CREATE_COURSES,
  GET_ALL_COURSES,
  GET_COURSES,
  GET_STUDENT_COURSES,
  UPDATE_COURSES,
} from '../core/graphql.operations';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable()
export class CourseServiceGraphql {
  public object: Observable<any[]>;
  private observable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private skip = 0;
  private data: any[] = [];
  private completed = false;

  constructor(private apollo: Apollo) {
    this.observable = new BehaviorSubject<any[]>([]);
    this.object = this.observable.asObservable();
  }
  public loading = false;
  resetPagination(): void {
    this.skip = 0;
    this.completed = false;
    this.data = [];
    this.observable.next(this.data);
  }

  loadMore(take: number = 10, reset: boolean = false): Observable<boolean> {
    if (this.completed) {
      return from([true]);
    }

    return this.apollo
      .query<any>({
        query: GET_COURSES,
        fetchPolicy: 'network-only',
        variables: { limit: take, offset: this.skip },
      })
      .pipe(
        map((result) => result?.data?.getCourses || []),
        tap((values) => {
          if (values.length === 0) {
            this.completed = true;
          } else {
            this.data = reset ? [...values] : [...this.data, ...values];
            this.observable.next(this.data);
            this.skip += values.length;
            console.log(this.skip);
          }
        }),
        map((values) => values.length > 0)
      );
  }

  async getAllCourses(): Promise<{ id: string; name: string; code: string }[]> {
    try {
      const result: ApolloQueryResult<{ getAllCourses: { id: string; name: string; code: string }[] }> = 
        await lastValueFrom(
          this.apollo.query<{ getAllCourses: { id: string; name: string; code: string }[] }>({
            query: GET_ALL_COURSES,
            fetchPolicy: 'network-only',
          })
        );
  
      return result?.data?.getAllCourses || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  getStudentsForCourses(code: string): Observable<any> {
    return this.apollo
      .query({
        query: GET_STUDENT_COURSES,
        fetchPolicy: 'network-only',
        variables: { code: code },
      })
      .pipe(map((result: any) => result.data?.course));
  }

  createCourse(courseData: { name: string }): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_COURSES,
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.input));
  }

  updateCourse(courseData: { name: string }): Observable<any> {
    //update data
    return this.apollo
      .mutate({
        mutation: UPDATE_COURSES,
        variables: { input: courseData },
      })
      .pipe(map((result: any) => result.data?.UpdateCourseInput));
  }
}
