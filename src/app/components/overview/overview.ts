import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student.model';
import { StudentFormComponent } from '../student-form/student-form';

// PrimeNG Modules & Services
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    StudentFormComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService], // Providers for the services
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  students: Student[] = [];
  private studentService = inject(StudentService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  displayAddDialog = false;
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

  // Add Student Methods
  showAddDialog(): void {
    this.displayAddDialog = true;
  }

  onStudentAdded(student: Omit<Student, 'id'>): void {
    this.studentService.addStudent(student).subscribe({
      next: () => {
        this.getStudents(); 
        this.displayAddDialog = false; 
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student added successfully'
        });
      },
      error: (err) => {
        console.error('Failed to add student', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not add student'
        });
      }
    });
  }

  // Edit Student Methods
  showEditDialog(student: Student): void {
    this.selectedStudent = student;
    this.displayEditDialog = true;
  }

  onStudentUpdated(studentData: Omit<Student, 'id'>): void {
    if (!this.selectedStudent) {
      return;
    }
    this.studentService.updateStudentCourses(this.selectedStudent.id, studentData.courses).subscribe({
      next: () => {
        this.getStudents();
        this.displayEditDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student updated successfully'
        });
      },
      error: (err) => {
        console.error('Failed to update student', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not update student'
        });
      }
    });
  }

  // Delete Student Method
  confirmDelete(student: Student): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${student.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentService.deleteStudent(student.id).subscribe({
          next: () => {
            this.getStudents();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student deleted successfully'
            });
          },
          error: (err) => {
            console.error('Failed to delete student', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not delete student'
            });
          }
        });
      }
    });
  }
}