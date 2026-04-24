import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workout, WorkoutExercise } from '../../models/workout/workout.model';
import { Serie } from '../../models/exercise/exercise-history.model';
import { Exercise } from '../../models/exercise/exercise.model';
import { EntrenamientoService } from '../../services/entrenamiento.service';
import { FirebaseEntrenamientoService } from '../../services/firebase-entrenamiento.service';
import { FirebaseHistorialService } from '../../services/firebase-historial.service';
import { Entrenamiento } from '../../models/entrenamiento/entrenamiento.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rutina',
  imports: [CommonModule, FormsModule],
  templateUrl: './rutina.component.html',
  styleUrl: './rutina.component.css'
})
export class RutinaComponent implements OnInit, OnDestroy {
  selectedDate: string = '';
  selectedWorkout: Workout | null = null;
  workouts: Workout[] = [];
  currentWorkoutExercises: WorkoutExercise[] = [];
  showAddExerciseModal = false;
  availableExercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  isSaving = false;
  savedMessage = '';
  private entrenamientosSub?: Subscription;

  constructor(
    private entrenamientoService: EntrenamientoService,
    private firebaseEntrenamiento: FirebaseEntrenamientoService,
    private firebaseHistorial: FirebaseHistorialService
  ) {
    this.setDefaultDate();
  }

  ngOnInit() {
    this.loadWorkoutsFromFirebase();
    this.loadAvailableExercises();
  }

  ngOnDestroy() {
    this.entrenamientosSub?.unsubscribe();
  }

  setDefaultDate() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  loadWorkoutsFromFirebase() {
    this.entrenamientosSub = this.firebaseEntrenamiento.getEntrenamientos$().subscribe(entrenamientos => {
      const entrenamientosMapeados: Workout[] = entrenamientos.map(ent => ({
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

      this.workouts = [
        ...entrenamientosMapeados,
        {
          id: 999,
          nombre: 'Entrenamiento a Medida',
          descripcion: 'Crea tu propio entrenamiento seleccionando ejercicios personalizados',
          ejercicios: []
        }
      ];

      // Si el workout seleccionado ya no existe en la lista actualizada, lo deseleccionamos
      if (this.selectedWorkout && this.selectedWorkout.id !== 999) {
        const sigue = this.workouts.find(w => w.id === this.selectedWorkout!.id);
        if (!sigue) {
          this.selectedWorkout = null;
          this.currentWorkoutExercises = [];
        }
      }
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

  async guardarEntrenamiento() {
    const ejerciciosConSeries = this.currentWorkoutExercises.filter(ex => ex.series.length > 0);
    if (!ejerciciosConSeries.length) return;

    this.isSaving = true;
    this.savedMessage = '';

    try {
      const promesas = ejerciciosConSeries.map(ex => {
        const pesoMaximo = Math.max(...ex.series.map(s => s.peso));
        const ultimaSerie = ex.series[ex.series.length - 1];
        return this.firebaseHistorial.agregarAlHistorial({
          ejercicioId: ex.id,
          nombreEjercicio: ex.nombre,
          fecha: new Date(this.selectedDate).toISOString(),
          series: ex.series.length,
          repeticiones: ultimaSerie.repeticiones,
          peso: pesoMaximo,
          notas: `${this.selectedWorkout?.nombre} — ${ex.series.map(s => `${s.repeticiones}x${s.peso}kg`).join(', ')}`
        });
      });

      await Promise.all(promesas);

      this.savedMessage = '✅ Entrenamiento guardado correctamente';
      // Limpiar series tras guardar
      this.currentWorkoutExercises = this.currentWorkoutExercises.map(ex => ({
        ...ex,
        series: [],
        repeticionesInput: undefined,
        pesoInput: undefined
      }));
    } catch (error: any) {
      const msg = typeof error === 'string' ? error : JSON.stringify(error);
      this.savedMessage = msg.includes('PERMISSION_DENIED')
        ? '❌ Sin permisos en Firebase. Despliega las reglas de base de datos.'
        : '❌ Error al guardar: ' + msg;
    } finally {
      this.isSaving = false;
      setTimeout(() => (this.savedMessage = ''), 5000);
    }
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
