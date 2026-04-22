import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workout, WorkoutExercise } from '../../models/workout/workout.model';
import { Serie } from '../../models/exercise/exercise-history.model';
import { Exercise } from '../../models/exercise/exercise.model';

@Component({
  selector: 'app-rutina',
  imports: [CommonModule, FormsModule],
  templateUrl: './rutina.component.html',
  styleUrl: './rutina.component.css'
})
export class RutinaComponent {
  selectedDate: string = '';
  selectedWorkout: Workout | null = null;
  workouts: Workout[] = [];
  currentWorkoutExercises: WorkoutExercise[] = [];
  showAddExerciseModal = false;
  availableExercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];

  constructor() {
    this.loadWorkouts();
    this.loadAvailableExercises();
    this.setDefaultDate();
  }

  setDefaultDate() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  loadWorkouts() {
    // Workouts predefinidos
    this.workouts = [
      {
        id: 1,
        nombre: 'Tren Superior - Push',
        descripcion: 'Enfoque en pecho, hombros y tríceps',
        ejercicios: [
          {
            id: 1,
            nombre: 'Press de Banca',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 2,
            nombre: 'Press Militar',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 3,
            nombre: 'Extensión de Tríceps',
            imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          }
        ]
      },
      {
        id: 2,
        nombre: 'Tren Superior - Pull',
        descripcion: 'Enfoque en espalda y bíceps',
        ejercicios: [
          {
            id: 4,
            nombre: 'Dominadas',
            imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 5,
            nombre: 'Remo con Barra',
            imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 6,
            nombre: 'Bíceps con Mancuernas',
            imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          }
        ]
      },
      {
        id: 3,
        nombre: 'Tren Inferior',
        descripcion: 'Enfoque en piernas y glúteos',
        ejercicios: [
          {
            id: 7,
            nombre: 'Sentadilla',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 8,
            nombre: 'Peso Muerto',
            imagen: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 9,
            nombre: 'Prensa de Piernas',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          }
        ]
      },
      {
        id: 4,
        nombre: 'Full Body',
        descripcion: 'Entrenamiento completo del cuerpo',
        ejercicios: [
          {
            id: 10,
            nombre: 'Press de Banca',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 11,
            nombre: 'Sentadilla',
            imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          },
          {
            id: 12,
            nombre: 'Dominadas',
            imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
            series: [],
            repeticionesInput: undefined,
            pesoInput: undefined,
            editando: false
          }
        ]
      },
      {
        id: 5,
        nombre: 'Entrenamiento a Medida',
        descripcion: 'Crea tu propio entrenamiento seleccionando ejercicios personalizados',
        ejercicios: []
      }
    ];
  }

  loadAvailableExercises() {
    // Cargar ejercicios disponibles desde la "base de datos" (mismos que en historial)
    this.availableExercises = [
      {
        id: 1,
        nombre: 'Press de Banca',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 100,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        historial: []
      },
      {
        id: 2,
        nombre: 'Bíceps con Mancuernas',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 30,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        historial: []
      },
      {
        id: 3,
        nombre: 'Peso Muerto',
        imagen: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=300&h=200&fit=crop',
        pesoMaximo: 150,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        historial: []
      },
      {
        id: 4,
        nombre: 'Sentadilla',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 120,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        historial: []
      },
      {
        id: 5,
        nombre: 'Dominadas',
        imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
        pesoMaximo: 80,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        historial: []
      },
      {
        id: 6,
        nombre: 'Remo con Barra',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 110,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 4,
        historial: []
      },
      {
        id: 7,
        nombre: 'Press Militar',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 60,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        historial: []
      },
      {
        id: 8,
        nombre: 'Extensión de Tríceps',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 40,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        historial: []
      },
      {
        id: 9,
        nombre: 'Prensa de Piernas',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 200,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        historial: []
      }
    ];
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
