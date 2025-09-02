import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
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
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  styles: [
    `
      :host ::ng-deep {
        /* --- GENERAL LAYOUT & CARD STYLING --- */
        .card {
          margin: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          background-color: #f4f5f7;
        }

        /* --- TABLE HEADER STYLING --- */
        .p-datatable .p-datatable-thead > tr > th {
          background: #4a4e69;
          color: #ffffff;
          text-transform: uppercase;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
        }

        /* --- CARD-LIKE TABLE ROW STYLING --- */
        .p-datatable .p-datatable-table {
          border-collapse: separate;
          border-spacing: 0 0.75rem;
        }

        .p-datatable .p-datatable-tbody > tr {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        /* Even rows */
        .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background-color: #eef2f7; /* Soft white-blue */
        }

        /* Odd rows */
        .p-datatable .p-datatable-tbody > tr:nth-child(odd) {
          background-color: #ffffff; /* White */
        }

        .p-datatable .p-datatable-tbody > tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }

        .p-datatable .p-datatable-tbody > tr > td {
          padding: 1.25rem 1.25rem;
          vertical-align: middle;
          border: none;
        }

        /* Round the corners of the first cell */
        .p-datatable .p-datatable-tbody > tr > td:first-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }

        /* Round the corners of the last cell */
        .p-datatable .p-datatable-tbody > tr > td:last-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        /* --- BUTTON OUTLINE FIX --- */
        .p-button:focus {
          box-shadow: none;
          outline: none;
        }

        /* --- PAGINATOR STYLING --- */
        .p-paginator {
          .p-paginator-current {
            order: -1;
            margin-right: auto;
          }
          .p-paginator-prev::before {
            content: "Prev";
            margin-right: 0.5rem;
          }
          .p-paginator-next::after {
            content: "Next";
            margin-left: 0.5rem;
          }
        }

        .ml-2 {
          margin-left: 0.5rem;
        }
      }
    `,
  ],
  template: `
    <div class="card">
      <p-toolbar>
        <div class="p-toolbar-group-start">
          <p-button
            label="New Student"
            styleClass="p-button-success"
            (click)="showAddDialog()"
          >
          </p-button>
        </div>
      </p-toolbar>

      <p-table
        [value]="students"
        [paginator]="true"
        [rows]="20"
        [rowsPerPageOptions]="[5, 10, 20, 50, 100]"
        [loading]="isLoading"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Courses</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-student>
          <tr>
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.dob | date: 'longDate' }}</td>
            <td>{{ student.courses.join(', ') }}</td>
            <td>
              <p-button
                label="Edit"
                styleClass="p-button-info p-button-sm"
                (click)="showEditDialog(student)"
              >
              </p-button>
              <p-button
                label="Delete"
                styleClass="p-button-danger p-button-sm"
                (click)="confirmDelete(student)"
                class="ml-2"
              >
              </p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4">
              No students found. Click "New Student" to add one.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog
      header="Add New Student"
      [(visible)]="displayAddDialog"
      [modal]="true"
      [style]="{ width: '50vw', height: 'auto' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="selectedStudent = null"
    >
      <app-student-form
        *ngIf="!selectedStudent"
        (formSubmit)="onStudentAdded($event)"
        (formCancel)="displayAddDialog = false"
      >
      </app-student-form>
    </p-dialog>

    <p-dialog
      header="Edit Student Courses"
      [(visible)]="displayEditDialog"
      [modal]="true"
      [style]="{ width: '50vw', height: 'auto' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="selectedStudent = null"
    >
      <app-student-form
        *ngIf="selectedStudent"
        [student]="selectedStudent"
        (formSubmit)="onStudentUpdated($event)"
        (formCancel)="displayEditDialog = false"
      >
      </app-student-form>
    </p-dialog>

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `,
})
export class OverviewComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  private studentService = inject(StudentService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  displayAddDialog = false;
  displayEditDialog = false;
  selectedStudent: Student | null = null;
  isLoading = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStudents(): void {
    this.isLoading = true;
    this.studentService
      .getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.students = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load students', err);
          this.isLoading = false;
        },
      });
  }

  // Add Student Methods
  showAddDialog(): void {
    this.selectedStudent = null;
    this.displayAddDialog = true;
  }

  onStudentAdded(student: Omit<Student, 'id'>): void {
    this.studentService
      .addStudent(student)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getStudents();
          this.displayAddDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Student added successfully',
          });
        },
        error: (err) => {
          console.error('Failed to add student', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not add student',
          });
        },
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
    this.studentService
      .updateStudentCourses(this.selectedStudent.id, studentData.courses)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getStudents();
          this.displayEditDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Student updated successfully',
          });
        },
        error: (err) => {
          console.error('Failed to update student', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not update student',
          });
        },
      });
  }

  // Delete Student Method
  confirmDelete(student: Student): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${student.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentService
          .deleteStudent(student.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.getStudents();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Student deleted successfully',
              });
            },
            error: (err) => {
              console.error('Failed to delete student', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not delete student',
              });
            },
          });
      },
    });
  }
}