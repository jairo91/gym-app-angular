export interface HistorialEjercicio {
  id?: string;
  ejercicioId: number;
  nombreEjercicio: string;
  imagenEjercicio?: string;
  fecha: string;
  peso: number;
  repeticiones: number;
  repeticionesPorSerie?: string;
  series: number;
  notas?: string;
}
