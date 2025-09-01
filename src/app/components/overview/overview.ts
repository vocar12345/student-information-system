import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student'; 
import { Student } from '../../models/student.model';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

// PrimeNG Modules
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [CommonModule, TableModule, ToolbarModule, ButtonModule],
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