import { Injectable } from '@angular/core';
import { Entrenamiento, EntrenamientoEjercicio } from '../models/entrenamiento/entrenamiento.model';
import { Exercise } from '../models/exercise/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientoService {
  private readonly STORAGE_KEY = 'entrenamientos';

  constructor() {}

  // Obtener todos los entrenamientos
  getEntrenamientos(): Entrenamiento[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const entrenamientos = JSON.parse(stored);
      // Convertir fechas de string a Date
      return entrenamientos.map((ent: any) => ({
        ...ent,
        fechaCreacion: new Date(ent.fechaCreacion),
        fechaModificacion: new Date(ent.fechaModificacion)
      }));
    }
    return this.getEntrenamientosPorDefecto();
  }

  // Obtener entrenamiento por ID
  getEntrenamientoById(id: number): Entrenamiento | null {
    const entrenamientos = this.getEntrenamientos();
    return entrenamientos.find(ent => ent.id === id) || null;
  }

  // Crear nuevo entrenamiento
  crearEntrenamiento(entrenamiento: Omit<Entrenamiento, 'id' | 'fechaCreacion' | 'fechaModificacion'>): Entrenamiento {
    const entrenamientos = this.getEntrenamientos();
    const nuevoEntrenamiento: Entrenamiento = {
      ...entrenamiento,
      id: this.generateId(),
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    };

    entrenamientos.push(nuevoEntrenamiento);
    this.saveEntrenamientos(entrenamientos);
    return nuevoEntrenamiento;
  }

  // Actualizar entrenamiento
  actualizarEntrenamiento(id: number, cambios: Partial<Entrenamiento>): boolean {
    const entrenamientos = this.getEntrenamientos();
    const index = entrenamientos.findIndex(ent => ent.id === id);

    if (index !== -1) {
      entrenamientos[index] = {
        ...entrenamientos[index],
        ...cambios,
        fechaModificacion: new Date()
      };
      this.saveEntrenamientos(entrenamientos);
      return true;
    }
    return false;
  }

  // Eliminar entrenamiento
  eliminarEntrenamiento(id: number): boolean {
    const entrenamientos = this.getEntrenamientos();
    const filtered = entrenamientos.filter(ent => ent.id !== id);

    if (filtered.length !== entrenamientos.length) {
      this.saveEntrenamientos(filtered);
      return true;
    }
    return false;
  }

  // Obtener ejercicios disponibles para seleccionar
  getEjerciciosDisponibles(): Exercise[] {
    return [
      // PECHO
      {
        id: 1,
        nombre: 'Press de Banca',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 100,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        grupoMuscular: 'Pecho',
        historial: []
      },
      // BÍCEPS
      {
        id: 2,
        nombre: 'Bíceps con Mancuernas',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 30,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        grupoMuscular: 'Bíceps',
        historial: []
      },
      // ESPALDA
      {
        id: 3,
        nombre: 'Peso Muerto',
        imagen: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=300&h=200&fit=crop',
        pesoMaximo: 150,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        grupoMuscular: 'Espalda',
        historial: []
      },
      // PIERNA
      {
        id: 4,
        nombre: 'Sentadilla',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 120,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        grupoMuscular: 'Pierna',
        historial: []
      },
      // ESPALDA
      {
        id: 5,
        nombre: 'Dominadas',
        imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
        pesoMaximo: 80,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        grupoMuscular: 'Espalda',
        historial: []
      },
      // ESPALDA
      {
        id: 6,
        nombre: 'Remo con Barra',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 110,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 4,
        grupoMuscular: 'Espalda',
        historial: []
      },
      // HOMBRO
      {
        id: 7,
        nombre: 'Press Militar',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 60,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        grupoMuscular: 'Hombro',
        historial: []
      },
      // TRÍCEPS
      {
        id: 8,
        nombre: 'Extensión de Tríceps',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 40,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        grupoMuscular: 'Tríceps',
        historial: []
      },
      // PIERNA
      {
        id: 9,
        nombre: 'Prensa de Piernas',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 200,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        grupoMuscular: 'Pierna',
        historial: []
      },
      // ABDOMINALES
      {
        id: 10,
        nombre: 'Abdominales en Máquina',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 80,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        grupoMuscular: 'Abdominales',
        historial: []
      },
      // BÍCEPS
      {
        id: 11,
        nombre: 'Curl de Bíceps en Barra',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 45,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 3,
        grupoMuscular: 'Bíceps',
        historial: []
      },
      // HOMBRO
      {
        id: 12,
        nombre: 'Elevaciones Laterales',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 20,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        grupoMuscular: 'Hombro',
        historial: []
      },
      // PIERNA
      {
        id: 13,
        nombre: 'Leg Curl',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 100,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        grupoMuscular: 'Pierna',
        historial: []
      },
      // PECHO
      {
        id: 14,
        nombre: 'Aperturas con Mancuernas',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 35,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        grupoMuscular: 'Pecho',
        historial: []
      },
      // TRÍCEPS
      {
        id: 15,
        nombre: 'Fondos entre Bancos',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 60,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 3,
        grupoMuscular: 'Tríceps',
        historial: []
      },
      // ESPALDA
      {
        id: 16,
        nombre: 'Jalón Lateral',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 90,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        grupoMuscular: 'Espalda',
        historial: []
      },
      // ABDOMINALES
      {
        id: 17,
        nombre: 'Crunches',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 0,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        grupoMuscular: 'Abdominales',
        historial: []
      }
    ];
  }

  private getEntrenamientosPorDefecto(): Entrenamiento[] {
    const ejerciciosDisponibles = this.getEjerciciosDisponibles();

    return [
      {
        id: 1,
        nombre: 'Tren Superior - Push',
        descripcion: 'Enfoque en pecho, hombros y tríceps',
        ejercicios: [
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 1)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 7)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 8)!)
        ],
        fechaCreacion: new Date('2026-04-01'),
        fechaModificacion: new Date('2026-04-01')
      },
      {
        id: 2,
        nombre: 'Tren Superior - Pull',
        descripcion: 'Enfoque en espalda y bíceps',
        ejercicios: [
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 5)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 6)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 2)!)
        ],
        fechaCreacion: new Date('2026-04-01'),
        fechaModificacion: new Date('2026-04-01')
      },
      {
        id: 3,
        nombre: 'Tren Inferior',
        descripcion: 'Enfoque en piernas y glúteos',
        ejercicios: [
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 4)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 3)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 9)!)
        ],
        fechaCreacion: new Date('2026-04-01'),
        fechaModificacion: new Date('2026-04-01')
      },
      {
        id: 4,
        nombre: 'Full Body',
        descripcion: 'Entrenamiento completo del cuerpo',
        ejercicios: [
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 1)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 4)!),
          this.convertirAEntrenamientoEjercicio(ejerciciosDisponibles.find(e => e.id === 5)!)
        ],
        fechaCreacion: new Date('2026-04-01'),
        fechaModificacion: new Date('2026-04-01')
      }
    ];
  }

  private convertirAEntrenamientoEjercicio(exercise: Exercise): EntrenamientoEjercicio {
    return {
      id: exercise.id,
      nombre: exercise.nombre,
      imagen: exercise.imagen,
      seriesRecomendadas: exercise.series,
      repeticionesRecomendadas: '8-12',
      pesoRecomendado: exercise.pesoMaximo * 0.7,
      notas: ''
    };
  }

  private generateId(): number {
    const entrenamientos = this.getEntrenamientos();
    const maxId = entrenamientos.length > 0 ? Math.max(...entrenamientos.map(ent => ent.id)) : 0;
    return maxId + 1;
  }

  private saveEntrenamientos(entrenamientos: Entrenamiento[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entrenamientos));
  }
}
