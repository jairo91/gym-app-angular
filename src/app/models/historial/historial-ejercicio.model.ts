export interface HistorialEjercicio {
  id?: string;
  ejercicioId: number;
  nombreEjercicio: string;
  fecha: string;
  peso: number;
  repeticiones: number;
  series: number;
  notas?: string;
}
