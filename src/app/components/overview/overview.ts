import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Corrected path below to match your filename
import { StudentService } from '../../services/student'; 
import { Student } from '../../models/student.model';

// PrimeNG Modules
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  students: Student[] = [];
  private studentService = inject(StudentService);

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
      },
      error: (err: any) => {
        console.error('Failed to load students', err);
      }
    });
  }
}