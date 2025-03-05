import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import {
  CREATE_COURSES,
  GET_ALL_COURSES,
  GET_COURSES,
  UPDATE_COURSES,
} from '../core/graphql.operations';

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
    console.log(reset, this.skip);
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
            console.log('Values:', this.completed);
          } else {
            console.log('Reset in processing:', values, this.skip);
            //  this.data = reset ? [...values] : [...this.data, ...values];
            this.data = reset ? [...values] : [...this.data, ...values];
            this.observable.next(this.data);
            this.skip += values.length;
            console.log(this.skip);
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
