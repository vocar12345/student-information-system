import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

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
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-width: 400px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    .ng-invalid.ng-dirty {
      border-color: #e24c4c;
    }
  `],
  template: `
    <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="form-container">
      <div class="form-field">
        <label for="name">Name</label>
        <input id="name" pInputText formControlName="name" />
      </div>

      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" pInputText formControlName="email" />
      </div>

      <div class="form-field">
        <label for="dob">Date of Birth</label>
        <input type="date" id="dob" formControlName="dob" class="p-inputtext" />
      </div>

      <div class="form-field">
        <label for="courses">Courses</label>
        <p-multiSelect
          id="courses"
          [options]="availableCourses"
          formControlName="courses"
          optionLabel="name"
          optionValue="name"
          placeholder="Select Courses"
          appendTo="body"
          [panelStyle]="{'z-index': 9999}">
        </p-multiSelect>
      </div>

      <div class="form-actions">
        <p-button label="Cancel" type="button" styleClass="p-button-secondary" (click)="onCancel()"></p-button>
        <p-button label="Save" type="submit" [disabled]="studentForm.invalid"></p-button>
      </div>
    </form>
  `
})
export class StudentFormComponent implements OnInit, OnChanges {
  @Input() student?: Student;
  @Output() formSubmit = new EventEmitter<Omit<Student, 'id'>>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  studentForm!: FormGroup;
  availableCourses: Course[] = [];

  ngOnInit(): void {
    this.availableCourses = [
      { id: 1, name: "Mathematics" },
      { id: 2, name: "History" },
      { id: 3, name: "Physics" },
      { id: 4, name: "Computer Science" },
      { id: 5, name: "Chemistry" },
      { id: 6, name: "Literature" }
    ];

    this.studentForm = this.fb.group({
      name: [{ value: '', disabled: this.student != null }],
      email: [{ value: '', disabled: this.student != null }],
      dob: [{ value: '', disabled: this.student != null }],
      courses: [[], Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student'] && this.student) {
      this.studentForm.patchValue({
        name: this.student.name,
        email: this.student.email,
        dob: this.student.dob,
        courses: this.student.courses
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.formSubmit.emit(this.studentForm.getRawValue());
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
