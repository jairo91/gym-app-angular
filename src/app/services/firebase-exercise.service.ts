import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Exercise } from '../models/exercise/exercise.model';
import { ExerciseHistory } from '../models/exercise/exercise-history.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseExerciseService {
  private ejerciciosSubject = new BehaviorSubject<Exercise[]>([]);
  public ejercicios$ = this.ejerciciosSubject.asObservable();
  private readonly ejerciciosPorDefecto = this.getEjerciciosPorDefecto();

  constructor(
    private db: Database,
    private auth: Auth
  ) {
    void this.initializeService();
  }

  private async initializeService(): Promise<void> {
    console.log('Inicializando FirebaseExerciseService...');

    try {
      await this.initializeDefaultExercises();
    } catch (error) {
      console.error('Error inicializando ejercicios por defecto:', error);
      this.ejerciciosSubject.next(this.ejerciciosPorDefecto);
    }

    this.setupRealTimeSync();
  }

  /**
   * Configurar sincronización en tiempo real de ejercicios disponibles
   */
  private setupRealTimeSync() {
    const ejerciciosRef = ref(this.db, 'ejercicios-disponibles');
    
    onValue(ejerciciosRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const ejercicios = Object.entries(data).map(([id, ejercicio]: any) => ({
          ...ejercicio,
          id: ejercicio.id || id,
          historial: ejercicio.historial || []
        }));
        this.ejerciciosSubject.next(ejercicios);
      } else {
        this.ejerciciosSubject.next(this.ejerciciosPorDefecto);
      }
    });
  }

  /**
   * Inicializar ejercicios por defecto si no existen
   */
  private async initializeDefaultExercises(): Promise<void> {
    const ejerciciosRef = ref(this.db, 'ejercicios-disponibles');

    const snapshot = await get(ejerciciosRef);
    if (snapshot.exists()) {
      return;
    }

    const ejerciciosDefecto = this.ejerciciosPorDefecto;
    this.ejerciciosSubject.next(ejerciciosDefecto);

    const data: Record<number, Exercise> = {};

    ejerciciosDefecto.forEach(ej => {
      data[ej.id] = ej;
    });

    try {
      await set(ejerciciosRef, data);
    } catch (error) {
      console.warn('No se pudieron persistir los ejercicios por defecto en Firebase. Se usarán localmente.', error);
    }
  }

  /**
   * Obtener todos los ejercicios disponibles como observable
   */
  getEjerciciosDisponibles$(): Observable<Exercise[]> {
    return this.ejercicios$.pipe(
      map(ejercicios => ejercicios.length > 0 ? ejercicios : this.ejerciciosPorDefecto)
    );
  }

  /**
   * Obtener ejercicio por ID
   */
  getEjercicioById$(id: number): Observable<Exercise | null> {
    const ejercicioRef = ref(this.db, `ejercicios-disponibles/${id}`);
    
    return new Observable(observer => {
      onValue(ejercicioRef, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          observer.next({
            ...data,
            historial: data.historial || []
          });
        } else {
          observer.next(null);
        }
      });
    });
  }

  /**
   * Agregar registro al historial de un ejercicio
   */
  agregarAlHistorial(ejercicioId: number, record: ExerciseHistory): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const historialRef = ref(this.db, `usuarios/${uid}/historial-ejercicios/${ejercicioId}`);
    const recordId = Date.now();

    return set(ref(this.db, `usuarios/${uid}/historial-ejercicios/${ejercicioId}/${recordId}`), {
      ...record,
      fechaRegistro: new Date().toISOString()
    });
  }

  /**
   * Obtener historial de un ejercicio
   */
  getHistorialEjercicio$(ejercicioId: number): Observable<ExerciseHistory[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return new Observable(observer => observer.next([]));
    }

    const historialRef = ref(this.db, `usuarios/${uid}/historial-ejercicios/${ejercicioId}`);
    
    return new Observable(observer => {
      onValue(historialRef, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const registros = Object.entries(data).map(([id, record]: any) => ({
            ...record,
            id: id
          }));
          observer.next(registros);
        } else {
          observer.next([]);
        }
      });
    });
  }

  /**
   * Actualizar ejercicio
   */
  actualizarEjercicio(id: number, cambios: Partial<Exercise>): Promise<void> {
    const ejercicioRef = ref(this.db, `ejercicios-disponibles/${id}`);
    
    const updateData = { ...cambios };
    delete (updateData as any).historial;
    delete (updateData as any).id;

    return update(ejercicioRef, updateData);
  }

  /**
   * Obtener ejercicios por defecto (datos iniciales)
   */
  private getEjerciciosPorDefecto(): Exercise[] {
    return [
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
}
