import { gql } from 'apollo-angular';


export const GET_STUDENTS = gql`
  query GetStudent($limit: Int!, $offset: Int!) {
    getStudent(limit: $limit, offset: $offset) {
      student {
        id
        fname
        lname
        email
        dob
        age
      }
      paginationObject {
        total
      }
    }
  }
`;


export const CREATE_STUDENTS = gql`
  mutation createStudent($input: CreateStudentInputDto!) {
    createStudent(createStudentInputDto: $input) {
      id
      fname
      lname
      email
      dob
    }
  }
`;


export const UPDATE_STUDENTS = gql`
  mutation updateStudent($input: UpdateStudentInput!) {
    updateStudent(UpdateStudentInput: $input) {
      id
      fname
      lname
      email
      dob
    }
  }
`;

export const DELETE_STUDENT=gql`
mutation deleteStudent($id: String!){
  deleteStudent(id:$id)
}
`;



export const DOWNLOAD_STUDENTS = gql`
  query DownloadStudent($age: Int!, $token: String!) {
    downloadExcel(age: $age, token: $token)
  }
`;