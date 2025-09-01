import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student.model';
import { StudentFormComponent } from '../student-form/student-form';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    StudentFormComponent
  ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  students: Student[] = [];
  private studentService = inject(StudentService);

  // Properties for the Add Dialog
  displayAddDialog = false;

  // --- NEW PROPERTIES FOR THE EDIT DIALOG ---
  displayEditDialog = false;
  selectedStudent: Student | null = null;

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => (this.students = data),
      error: (err) => console.error('Failed to load students', err)
    });
  }

  // --- Methods for Adding a Student ---
  showAddDialog(): void {
    this.displayAddDialog = true;
  }

  onStudentAdded(student: Omit<Student, 'id'>): void {
    this.studentService.addStudent(student).subscribe({
      next: () => {
        this.getStudents(); 
        this.displayAddDialog = false; 
      },
      error: (err) => console.error('Failed to add student', err)
    });
  }

  // --- NEW METHODS FOR EDITING A STUDENT ---
  showEditDialog(student: Student): void {
    this.selectedStudent = student;
    this.displayEditDialog = true;
  }

  onStudentUpdated(studentData: Omit<Student, 'id'>): void {
    if (!this.selectedStudent) {
      return; // Safety check
    }

    this.studentService.updateStudentCourses(this.selectedStudent.id, studentData.courses).subscribe({
      next: () => {
        this.getStudents(); // Refresh the list
        this.displayEditDialog = false; // Close the dialog
      },
      error: (err) => console.error('Failed to update student', err)
    });
  }
}