import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, remove, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

export interface HistorialEjercicio {
  id: string;
  ejercicioId: number;
  nombreEjercicio: string;
  fecha: string;
  peso: number;
  repeticiones: number;
  series: number;
  notas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseHistorialService {
  private historialSubject = new BehaviorSubject<HistorialEjercicio[]>([]);
  public historial$ = this.historialSubject.asObservable();

  constructor(
    private db: Database,
    private auth: Auth
  ) {
    this.setupRealTimeSync();
  }

  /**
   * Configurar sincronización en tiempo real del historial
   */
  private setupRealTimeSync() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const historialRef = ref(this.db, `usuarios/${user.uid}/historial`);
        
        onValue(historialRef, snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const historial = Object.entries(data).map(([id, record]: any) => ({
              id,
              ...record
            }));
            // Ordenar por fecha descendente
            historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            this.historialSubject.next(historial);
          } else {
            this.historialSubject.next([]);
          }
        });
      } else {
        this.historialSubject.next([]);
      }
    });
  }

  /**
   * Obtener historial completo como observable
   */
  getHistorial$(): Observable<HistorialEjercicio[]> {
    return this.historial$;
  }

  /**
   * Obtener historial de un ejercicio específico
   */
  getHistorialEjercicio$(ejercicioId: number): Observable<HistorialEjercicio[]> {
    return this.historial$.pipe(
      // Mapear y filtrar registros del ejercicio
    );
  }

  /**
   * Agregar registro al historial
   */
  agregarAlHistorial(registro: Omit<HistorialEjercicio, 'id'>): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const historialRef = ref(this.db, `usuarios/${uid}/historial`);
    const nuevoId = Date.now().toString();

    const nuevoRegistro = {
      ...registro,
      fecha: new Date().toISOString()
    };

    return set(ref(this.db, `usuarios/${uid}/historial/${nuevoId}`), nuevoRegistro).then(() => nuevoId);
  }

  /**
   * Actualizar registro del historial
   */
  actualizarRegistro(id: string, cambios: Partial<HistorialEjercicio>): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const recordRef = ref(this.db, `usuarios/${uid}/historial/${id}`);
    return update(recordRef, cambios);
  }

  /**
   * Eliminar registro del historial
   */
  eliminarRegistro(id: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const recordRef = ref(this.db, `usuarios/${uid}/historial/${id}`);
    return remove(recordRef);
  }

  /**
   * Obtener estadísticas de un ejercicio
   */
  getEstadisticasEjercicio$(ejercicioId: number): Observable<{
    pesoMaximo: number;
    pesoPromedio: number;
    totalSeries: number;
    ultimaFecha: string;
  } | null> {
    return new Observable(observer => {
      this.historial$.subscribe(historial => {
        const registros = historial.filter(r => r.ejercicioId === ejercicioId);
        
        if (registros.length === 0) {
          observer.next(null);
          return;
        }

        const pesos = registros.map(r => r.peso);
        const pesoMaximo = Math.max(...pesos);
        const pesoPromedio = pesos.reduce((a, b) => a + b, 0) / pesos.length;
        const totalSeries = registros.reduce((sum, r) => sum + r.series, 0);
        const ultimaFecha = registros[0].fecha;

        observer.next({
          pesoMaximo,
          pesoPromedio: Math.round(pesoPromedio * 100) / 100,
          totalSeries,
          ultimaFecha
        });
      });
    });
  }

  /**
   * Obtener historial de un mes específico
   */
  getHistorialMes$(anio: number, mes: number): Observable<HistorialEjercicio[]> {
    return this.historial$.pipe(
      // Mapear y filtrar registros del mes
    );
  }
}
