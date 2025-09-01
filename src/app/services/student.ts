import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // This is the new method you just added
  updateStudentCourses(id: number, courses: string[]): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<Student>(url, { courses: courses });
  }
  deleteStudent(id: number): Observable<void> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.delete<void>(url);
  }
}