import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Entrenamiento, EntrenamientoEjercicio } from '../../models/entrenamiento/entrenamiento.model';
import { Exercise } from '../../models/exercise/exercise.model';
import { FirebaseEntrenamientoService } from '../../services/firebase-entrenamiento.service';
import { FirebaseExerciseService } from '../../services/firebase-exercise.service';
import { EntrenamientoService } from '../../services/entrenamiento.service';

@Component({
  selector: 'app-entrenamientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponent implements OnInit {
  entrenamientos$!: Observable<Entrenamiento[]>;
  availableExercises: Exercise[] = [];
  
  showCreateModal = false;
  showEditModal = false;
  showExerciseModal = false;
  editingEntrenamiento: Entrenamiento | null = null;
  
  isLoading = false;
  errorMessage = '';

  // Form data
  nuevoEntrenamiento = {
    nombre: '',
    descripcion: ''
  };

  selectedExercises: Exercise[] = [];
  currentEntrenamientoExercises: EntrenamientoEjercicio[] = [];

  constructor(
    private firebaseEntrenamiento: FirebaseEntrenamientoService,
    private firebaseExercise: FirebaseExerciseService,
    private entrenamientoService: EntrenamientoService
  ) {}

  ngOnInit() {
    // Inicializar observables después de la construcción
    console.log('Inicializando componentes y cargando datos...');
    this.entrenamientos$ = this.firebaseEntrenamiento.getEntrenamientos$();
    this.availableExercises = this.entrenamientoService.getEjerciciosDisponibles();

    this.firebaseExercise.getEjerciciosDisponibles$().subscribe({
      next: (ejercicios) => {
        this.availableExercises = ejercicios.length > 0
          ? ejercicios
          : this.entrenamientoService.getEjerciciosDisponibles();
      },
      error: () => {
        this.availableExercises = this.entrenamientoService.getEjerciciosDisponibles();
      }
    });
  }

  // Crear entrenamiento
  abrirModalCrear() {
    this.nuevoEntrenamiento = { nombre: '', descripcion: '' };
    this.selectedExercises = [];
    this.currentEntrenamientoExercises = [];
    this.showCreateModal = true;
  }

  cerrarModalCrear() {
    this.showCreateModal = false;
    this.nuevoEntrenamiento = { nombre: '', descripcion: '' };
    this.selectedExercises = [];
    this.currentEntrenamientoExercises = [];
  }

  guardarNuevoEntrenamiento() {
    if (!this.nuevoEntrenamiento.nombre.trim() || this.currentEntrenamientoExercises.length === 0) {
      this.errorMessage = 'Por favor, complete el nombre y seleccione al menos un ejercicio.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.firebaseEntrenamiento.crearEntrenamiento({
      nombre: this.nuevoEntrenamiento.nombre,
      descripcion: this.nuevoEntrenamiento.descripcion,
      ejercicios: this.currentEntrenamientoExercises
    }).then(() => {
      this.cerrarModalCrear();
      this.isLoading = false;
    }).catch(error => {
      this.errorMessage = 'Error al crear entrenamiento: ' + error;
      this.isLoading = false;
    });
  }

  // Editar entrenamiento
  abrirModalEditar(entrenamiento: Entrenamiento) {
    this.editingEntrenamiento = { ...entrenamiento };
    this.currentEntrenamientoExercises = [...entrenamiento.ejercicios];
    this.showEditModal = true;
  }

  cerrarModalEditar() {
    this.showEditModal = false;
    this.editingEntrenamiento = null;
    this.currentEntrenamientoExercises = [];
    this.selectedExercises = [];
  }

  guardarEdicionEntrenamiento() {
    if (!this.editingEntrenamiento?.nombre?.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    if (this.currentEntrenamientoExercises.length === 0) {
      this.errorMessage = 'Debe seleccionar al menos un ejercicio';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.firebaseEntrenamiento.actualizarEntrenamiento(this.editingEntrenamiento.id, {
      nombre: this.editingEntrenamiento.nombre,
      descripcion: this.editingEntrenamiento.descripcion,
      ejercicios: this.currentEntrenamientoExercises
    }).then(() => {
      this.cerrarModalEditar();
      this.isLoading = false;
    }).catch(error => {
      this.errorMessage = 'Error al actualizar: ' + error;
      this.isLoading = false;
    });
  }

  // Eliminar entrenamiento
  eliminarEntrenamiento(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
      this.isLoading = true;
      this.firebaseEntrenamiento.eliminarEntrenamiento(id).then(() => {
        this.isLoading = false;
      }).catch(error => {
        this.errorMessage = 'Error al eliminar: ' + error;
        this.isLoading = false;
      });
    }
  }

  // Gestión de ejercicios
  abrirModalEjercicios() {
    this.showExerciseModal = true;
  }

  cerrarModalEjercicios() {
    this.showExerciseModal = false;
  }

  toggleExerciseSelection(exercise: Exercise) {
    const index = this.selectedExercises.findIndex(ex => ex.id === exercise.id);
    if (index > -1) {
      // Remover ejercicio
      this.selectedExercises.splice(index, 1);
      this.currentEntrenamientoExercises = this.currentEntrenamientoExercises.filter(ex => ex.id !== exercise.id);
    } else {
      // Agregar ejercicio
      this.selectedExercises.push(exercise);
      const entrenamientoEjercicio: EntrenamientoEjercicio = {
        id: exercise.id,
        nombre: exercise.nombre,
        imagen: exercise.imagen,
        seriesRecomendadas: exercise.series,
        repeticionesRecomendadas: '8-12',
        pesoRecomendado: exercise.pesoMaximo * 0.7,
        notas: ''
      };
      this.currentEntrenamientoExercises.push(entrenamientoEjercicio);
    }
  }

  isExerciseSelected(exercise: Exercise): boolean {
    return this.selectedExercises.some(ex => ex.id === exercise.id);
  }

  // Remover ejercicio del entrenamiento actual
  removerEjercicioDelEntrenamiento(ejercicio: EntrenamientoEjercicio) {
    this.currentEntrenamientoExercises = this.currentEntrenamientoExercises.filter(ex => ex.id !== ejercicio.id);
    this.selectedExercises = this.selectedExercises.filter(ex => ex.id !== ejercicio.id);
  }

  // Helpers
  getSelectedExercisesCount(): number {
    return this.selectedExercises.length;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES');
  }
}
