import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Entrenamiento, EntrenamientoEjercicio } from '../../models/entrenamiento/entrenamiento.model';
import { Exercise } from '../../models/exercise/exercise.model';
import { FirebaseEntrenamientoService } from '../../services/firebase-entrenamiento.service';
import { FirebaseExerciseService } from '../../services/firebase-exercise.service';

@Component({
  selector: 'app-entrenamientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponentFirebase implements OnInit {
  entrenamientos$ = this.firebaseEntrenamiento.getEntrenamientos$();
  ejerciciosDisponibles$ = this.firebaseExercise.getEjerciciosDisponibles$();
  
  showCreateModal = false;
  showEditModal = false;
  showExerciseModal = false;
  
  editingEntrenamiento: Entrenamiento | null = null;
  newEntrenamientoName = '';
  newEntrenamientoDescription = '';
  selectedExercises: Exercise[] = [];
  currentEntrenamientoExercises: EntrenamientoEjercicio[] = [];
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private firebaseEntrenamiento: FirebaseEntrenamientoService,
    private firebaseExercise: FirebaseExerciseService
  ) {}

  ngOnInit() {
    // Los observables se sincronizan automáticamente
  }

  // Crear nuevo entrenamiento
  crearEntrenamiento() {
    if (!this.newEntrenamientoName.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.firebaseEntrenamiento.crearEntrenamiento({
      nombre: this.newEntrenamientoName,
      descripcion: this.newEntrenamientoDescription,
      ejercicios: this.selectedExercises.map(ex => ({
        id: ex.id,
        nombre: ex.nombre,
        imagen: ex.imagen,
        seriesRecomendadas: 3,
        repeticionesRecomendadas: '8-12',
        pesoRecomendado: 0,
        notas: ''
      }))
    }).then(() => {
      this.newEntrenamientoName = '';
      this.newEntrenamientoDescription = '';
      this.selectedExercises = [];
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

  guardarEdicionEntrenamiento() {
    if (!this.editingEntrenamiento) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.firebaseEntrenamiento.actualizarEntrenamiento(
      this.editingEntrenamiento.id,
      {
        nombre: this.editingEntrenamiento.nombre,
        descripcion: this.editingEntrenamiento.descripcion,
        ejercicios: this.currentEntrenamientoExercises
      }
    ).then(() => {
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

  // Abrir modal de selección de ejercicios
  abrirModalEjercicios() {
    this.showExerciseModal = true;
  }

  cerrarModalEjercicios() {
    this.showExerciseModal = false;
  }

  cerrarModalCrear() {
    this.showCreateModal = false;
  }

  cerrarModalEditar() {
    this.showEditModal = false;
    this.editingEntrenamiento = null;
  }

  // Toggle selección de ejercicio
  toggleExerciseSelection(exercise: Exercise) {
    const exists = this.selectedExercises.find(ex => ex.id === exercise.id);
    if (exists) {
      this.selectedExercises = this.selectedExercises.filter(ex => ex.id !== exercise.id);
    } else {
      this.selectedExercises.push(exercise);
    }
  }

  isExerciseSelected(exercise: Exercise): boolean {
    return this.selectedExercises.some(ex => ex.id === exercise.id);
  }

  // Remover ejercicio del entrenamiento actual
  removerEjercicioDelEntrenamiento(ejercicio: EntrenamientoEjercicio) {
    this.currentEntrenamientoExercises = this.currentEntrenamientoExercises.filter(ex => ex.id !== ejercicio.id);
  }

  // Agregar ejercicio al entrenamiento actual
  agregarEjercicioAlEntrenamiento(exercise: Exercise) {
    if (!this.currentEntrenamientoExercises.find(ex => ex.id === exercise.id)) {
      this.currentEntrenamientoExercises.push({
        id: exercise.id,
        nombre: exercise.nombre,
        imagen: exercise.imagen,
        seriesRecomendadas: 3,
        repeticionesRecomendadas: '8-12',
        pesoRecomendado: 0,
        notas: ''
      });
    }
  }

  getSelectedExercisesCount(): number {
    return this.currentEntrenamientoExercises.length;
  }
}
