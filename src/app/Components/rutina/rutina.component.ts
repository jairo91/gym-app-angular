import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workout, WorkoutExercise } from '../../models/workout/workout.model';
import { Serie } from '../../models/exercise/exercise-history.model';
import { Exercise } from '../../models/exercise/exercise.model';
import { EntrenamientoService } from '../../services/entrenamiento.service';
import { Entrenamiento } from '../../models/entrenamiento/entrenamiento.model';

@Component({
  selector: 'app-rutina',
  imports: [CommonModule, FormsModule],
  templateUrl: './rutina.component.html',
  styleUrl: './rutina.component.css'
})
export class RutinaComponent implements OnInit {
  selectedDate: string = '';
  selectedWorkout: Workout | null = null;
  workouts: Workout[] = [];
  currentWorkoutExercises: WorkoutExercise[] = [];
  showAddExerciseModal = false;
  availableExercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];

  constructor(private entrenamientoService: EntrenamientoService) {
    this.setDefaultDate();
  }

  ngOnInit() {
    this.loadWorkouts();
    this.loadAvailableExercises();
  }

  setDefaultDate() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  loadWorkouts() {
    // Cargar entrenamientos desde el servicio
    const entrenamientos = this.entrenamientoService.getEntrenamientos();

    // Convertir Entrenamiento[] a Workout[] para compatibilidad
    this.workouts = entrenamientos.map(ent => ({
      id: ent.id,
      nombre: ent.nombre,
      descripcion: ent.descripcion,
      ejercicios: ent.ejercicios.map(ej => ({
        id: ej.id,
        nombre: ej.nombre,
        imagen: ej.imagen,
        series: [],
        repeticionesInput: undefined,
        pesoInput: undefined,
        editando: false
      }))
    }));

    // Agregar opción de entrenamiento a medida
    this.workouts.push({
      id: 999,
      nombre: 'Entrenamiento a Medida',
      descripcion: 'Crea tu propio entrenamiento seleccionando ejercicios personalizados',
      ejercicios: []
    });
  }

  loadAvailableExercises() {
    this.availableExercises = this.entrenamientoService.getEjerciciosDisponibles();
  }

  get isSaveWorkoutDisabled(): boolean {
    return !this.selectedWorkout || this.currentWorkoutExercises.every(ex => ex.series.length === 0);
  }

  onWorkoutChange() {
    if (this.selectedWorkout) {
      // Crear una copia profunda de los ejercicios para evitar modificar el original
      this.currentWorkoutExercises = this.selectedWorkout.ejercicios.map(exercise => ({
        ...exercise,
        series: [...exercise.series],
        repeticionesInput: undefined,
        pesoInput: undefined,
        editando: false
      }));
    } else {
      this.currentWorkoutExercises = [];
    }
  }

  agregarSerie(exercise: WorkoutExercise) {
    if (exercise.repeticionesInput && exercise.repeticionesInput > 0 &&
        exercise.pesoInput && exercise.pesoInput > 0) {

      const nuevaSerie: Serie = {
        repeticiones: exercise.repeticionesInput,
        peso: exercise.pesoInput,
        unidad: 'kg'
      };

      exercise.series.push(nuevaSerie);

      // Limpiar inputs
      exercise.repeticionesInput = undefined;
      exercise.pesoInput = undefined;
    }
  }

  editarSerie(exercise: WorkoutExercise) {
    exercise.editando = !exercise.editando;
  }

  guardarSerie(exercise: WorkoutExercise) {
    // Aquí se podría validar y guardar en la base de datos
    exercise.editando = false;
  }

  eliminarSerie(exercise: WorkoutExercise, index: number) {
    exercise.series.splice(index, 1);
  }

  guardarEntrenamiento() {
    // Aquí se guardaría todo el entrenamiento en la base de datos
    const entrenamiento = {
      fecha: this.selectedDate,
      workout: this.selectedWorkout?.nombre,
      ejercicios: this.currentWorkoutExercises.map(ex => ({
        nombre: ex.nombre,
        series: ex.series
      }))
    };

    console.log('Guardando entrenamiento:', entrenamiento);
    alert('Entrenamiento guardado exitosamente!');
  }

  abrirModalAgregarEjercicio() {
    this.showAddExerciseModal = true;
    this.selectedExercises = [];
  }

  cerrarModalAgregarEjercicio() {
    this.showAddExerciseModal = false;
    this.selectedExercises = [];
  }

  toggleExerciseSelection(exercise: Exercise) {
    const index = this.selectedExercises.findIndex(ex => ex.id === exercise.id);
    if (index > -1) {
      this.selectedExercises.splice(index, 1);
    } else {
      this.selectedExercises.push(exercise);
    }
  }

  isExerciseSelected(exercise: Exercise): boolean {
    return this.selectedExercises.some(ex => ex.id === exercise.id);
  }

  guardarEjerciciosSeleccionados() {
    if (this.selectedExercises.length > 0) {
      // Convertir los ejercicios seleccionados a WorkoutExercise
      const nuevosEjercicios: WorkoutExercise[] = this.selectedExercises.map(exercise => ({
        id: exercise.id,
        nombre: exercise.nombre,
        imagen: exercise.imagen,
        series: [],
        repeticionesInput: undefined,
        pesoInput: undefined,
        editando: false
      }));

      // Agregar los nuevos ejercicios a los existentes
      this.currentWorkoutExercises = [...this.currentWorkoutExercises, ...nuevosEjercicios];

      this.cerrarModalAgregarEjercicio();
    }
  }

  // Método helper para mostrar el número de serie
  getSerieNumber(index: number): string {
    return `Serie ${index + 1}`;
  }
}
