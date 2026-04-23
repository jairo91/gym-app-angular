import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, remove, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

export interface RutinaDia {
  fecha: string;
  entrenamientoId: number;
  series: SeriePeso[];
  notas?: string;
}

export interface SeriePeso {
  ejercicioId: number;
  nombreEjercicio: string;
  numero: number;
  peso: number;
  repeticiones: number;
  completada: boolean;
  notas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseRutinaService {
  private rutinasSubject = new BehaviorSubject<RutinaDia[]>([]);
  public rutinas$ = this.rutinasSubject.asObservable();

  constructor(
    private db: Database,
    private auth: Auth
  ) {
    this.setupRealTimeSync();
  }

  /**
   * Configurar sincronización en tiempo real de rutinas del usuario
   */
  private setupRealTimeSync() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const rutinasRef = ref(this.db, `usuarios/${user.uid}/rutinas`);
        
        onValue(rutinasRef, snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const rutinas = Object.entries(data).map(([fecha, rutina]: any) => ({
              fecha,
              ...rutina
            }));
            this.rutinasSubject.next(rutinas);
          } else {
            this.rutinasSubject.next([]);
          }
        });
      } else {
        this.rutinasSubject.next([]);
      }
    });
  }

  /**
   * Obtener todas las rutinas como observable
   */
  getRutinas$(): Observable<RutinaDia[]> {
    return this.rutinas$;
  }

  /**
   * Obtener rutina de un día específico
   */
  getRutinaPorFecha$(fecha: string): Observable<RutinaDia | null> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return new Observable(observer => observer.next(null));
    }

    const rutinaRef = ref(this.db, `usuarios/${uid}/rutinas/${fecha}`);
    
    return new Observable(observer => {
      onValue(rutinaRef, snapshot => {
        if (snapshot.exists()) {
          observer.next({
            fecha,
            ...snapshot.val()
          });
        } else {
          observer.next(null);
        }
      });
    });
  }

  /**
   * Guardar o actualizar rutina de un día
   */
  guardarRutinaDia(fecha: string, rutina: Omit<RutinaDia, 'fecha'>): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const rutinaRef = ref(this.db, `usuarios/${uid}/rutinas/${fecha}`);
    return set(rutinaRef, {
      ...rutina,
      fechaActualizacion: new Date().toISOString()
    });
  }

  /**
   * Actualizar series de una rutina de día
   */
  actualizarSeriesRutina(fecha: string, series: SeriePeso[]): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const rutinaRef = ref(this.db, `usuarios/${uid}/rutinas/${fecha}`);
    return update(rutinaRef, {
      series,
      fechaActualizacion: new Date().toISOString()
    });
  }

  /**
   * Marcar una serie como completada
   */
  marcarSerieCompletada(fecha: string, serieIndex: number, completada: boolean): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const serieRef = ref(this.db, `usuarios/${uid}/rutinas/${fecha}/series/${serieIndex}/completada`);
    return set(serieRef, completada);
  }

  /**
   * Eliminar rutina de un día
   */
  eliminarRutinaDia(fecha: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const rutinaRef = ref(this.db, `usuarios/${uid}/rutinas/${fecha}`);
    return remove(rutinaRef);
  }

  /**
   * Obtener rutinas de un rango de fechas
   */
  getRutinasEnRango$(fechaInicio: string, fechaFin: string): Observable<RutinaDia[]> {
    return this.rutinas$.pipe(
      // Filtrar rutinas en el rango de fechas
    );
  }
}
