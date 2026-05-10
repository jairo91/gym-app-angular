import { ExerciseHistory } from './exercise-history.model';

export type GrupoMuscular = 'Pecho' | 'Espalda' | 'Bíceps' | 'Tríceps' | 'Hombro' | 'Pierna' | 'Abdominales';

export interface Exercise {
  id: number;
  nombre: string;
  imagen: string;
  pesoMaximo: number;
  unidad: string;
  fechaUltimo: string;
  series: number;
  grupoMuscular: GrupoMuscular;
  historial?: ExerciseHistory[];
}
