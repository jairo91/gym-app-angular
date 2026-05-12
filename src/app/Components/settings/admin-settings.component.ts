import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { FirebaseExerciseManagementService, GlobalExercise } from '../../services/firebase-exercise-management.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  exercises: GlobalExercise[] = [];
  isAdmin = false;
  showAddForm = false;
  editingId: string | null = null;
  
  exerciseForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  private subscriptions = new Subscription();

  gruposMuscularesOptions: string[] = [
    'Pecho',
    'Espalda',
    'Bíceps',
    'Tríceps',
    'Hombro',
    'Pierna',
    'Abdominales'
  ];

  constructor(
    private adminService: AdminService,
    private exerciseService: FirebaseExerciseManagementService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.exerciseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      imagen: ['', Validators.required],
      grupoMuscular: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario es admin
    this.subscriptions.add(
      this.adminService.isCurrentUserAdmin().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        if (!isAdmin) {
          this.router.navigate(['/']);
        }
      })
    );

    // Cargar los ejercicios globales
    this.subscriptions.add(
      this.exerciseService.getGlobalExercises().subscribe(exercises => {
        this.exercises = exercises;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editingId = null;
    this.exerciseForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  async submitExercise(): Promise<void> {
    if (this.exerciseForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    try {
      const formValue = this.exerciseForm.value;

      if (this.editingId) {
        // Actualizar ejercicio existente
        await this.exerciseService.updateGlobalExercise(this.editingId, formValue);
        this.successMessage = 'Ejercicio actualizado exitosamente';
        this.editingId = null;
      } else {
        // Agregar nuevo ejercicio
        await this.exerciseService.addGlobalExercise(formValue);
        this.successMessage = 'Ejercicio agregado exitosamente';
      }

      this.exerciseForm.reset();
      this.showAddForm = false;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      this.errorMessage = 'Error al guardar el ejercicio. Intenta nuevamente.';
      console.error('Error:', error);
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  editExercise(exercise: GlobalExercise): void {
    this.editingId = exercise.id || null;
    this.showAddForm = true;
    this.exerciseForm.patchValue({
      nombre: exercise.nombre,
      imagen: exercise.imagen,
      grupoMuscular: exercise.grupoMuscular,
      descripcion: exercise.descripcion || ''
    });
  }

  async deleteExercise(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
      try {
        await this.exerciseService.deleteGlobalExercise(id);
        this.successMessage = 'Ejercicio eliminado exitosamente';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error) {
        this.errorMessage = 'Error al eliminar el ejercicio. Intenta nuevamente.';
        console.error('Error:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.exerciseForm.reset();
    if (Object.keys(this.exerciseForm.value).every(key => !this.exerciseForm.value[key])) {
      this.showAddForm = false;
    }
  }
}
