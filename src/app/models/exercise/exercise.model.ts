import { ExerciseHistory } from './exercise-history.model';

export interface Exercise {
  id: number;
  nombre: string;
  imagen: string;
  pesoMaximo: number;
  unidad: string;
  fechaUltimo: string;
  series: number;
  historial?: ExerciseHistory[];
}
