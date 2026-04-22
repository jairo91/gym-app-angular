import { Serie } from '../exercise/exercise-history.model';

export interface Workout {
  id: number;
  nombre: string;
  descripcion?: string;
  ejercicios: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: number;
  nombre: string;
  imagen?: string;
  series: Serie[];
  repeticionesInput?: number;
  pesoInput?: number;
  editando?: boolean;
}