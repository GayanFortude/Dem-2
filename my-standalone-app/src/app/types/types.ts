export class paginationStudent {
  total: number
  constructor() {
    this.total = 0;
  }
}


export interface Student {
  id: string;
  fname: string;
  age:string;
  lname: string;
  email: string;
  dob: Date;
}



export interface GetStudentResponse {
  getStudent: {
    student: Student[];
    paginationObject: {
      total: number;
    };
  };
}



