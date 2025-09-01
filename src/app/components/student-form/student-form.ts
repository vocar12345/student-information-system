import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../models/student.model';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  @Input() student?: Student;
  @Output() formSubmit = new EventEmitter<Omit<Student, 'id'>>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  studentForm!: FormGroup;

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      courses: [[], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.formSubmit.emit(this.studentForm.value);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}