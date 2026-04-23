export interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ejercicios: EntrenamientoEjercicio[];
  fechaCreacion: Date;
  fechaModificacion: Date;
}

export interface EntrenamientoEjercicio {
  id: number;
  nombre: string;
  imagen: string;
  seriesRecomendadas: number;
  repeticionesRecomendadas: string;
  pesoRecomendado?: number;
  notas?: string;
}