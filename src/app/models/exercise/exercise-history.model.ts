export interface ExerciseHistory {
  fecha: string;
  series: Serie[];
}

export interface Serie {
  repeticiones: number;
  peso: number;
  unidad: string;
}