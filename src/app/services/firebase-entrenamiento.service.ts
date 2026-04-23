import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, remove, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Entrenamiento, EntrenamientoEjercicio } from '../models/entrenamiento/entrenamiento.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseEntrenamientoService {
  private entrenamientosSubject = new BehaviorSubject<Entrenamiento[]>([]);
  public entrenamientos$ = this.entrenamientosSubject.asObservable();

  constructor(
    private db: Database,
    private auth: Auth
  ) {
    this.setupRealTimeSync();
  }

  /**
   * Configura sincronización en tiempo real de entrenamientos del usuario actual
   */
  private setupRealTimeSync() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const entrenamientosRef = ref(this.db, `usuarios/${user.uid}/entrenamientos`);
        
        onValue(entrenamientosRef, snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const entrenamientos = Object.entries(data).map(([id, ent]: any) => ({
              ...ent,
              id: ent.id || id,
              fechaCreacion: new Date(ent.fechaCreacion),
              fechaModificacion: new Date(ent.fechaModificacion)
            }));
            this.entrenamientosSubject.next(entrenamientos);
          } else {
            this.entrenamientosSubject.next([]);
          }
        });
      } else {
        this.entrenamientosSubject.next([]);
      }
    });
  }

  /**
   * Obtener todos los entrenamientos como observable (recomendado para componentes)
   */
  getEntrenamientos$(): Observable<Entrenamiento[]> {
    return this.entrenamientos$;
  }

  /**
   * Obtener entrenamiento por ID
   */
  getEntrenamientoById$(id: number): Observable<Entrenamiento | null> {
    const entrenamientoRef = ref(this.db, `usuarios/${this.auth.currentUser?.uid}/entrenamientos/${id}`);
    return new Observable(observer => {
      onValue(entrenamientoRef, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          observer.next({
            ...data,
            fechaCreacion: new Date(data.fechaCreacion),
            fechaModificacion: new Date(data.fechaModificacion)
          });
        } else {
          observer.next(null);
        }
      });
    });
  }

  /**
   * Crear nuevo entrenamiento
   */
  async crearEntrenamiento(entrenamiento: Omit<Entrenamiento, 'id' | 'fechaCreacion' | 'fechaModificacion'>): Promise<number> {
    const uid = await this.getFirebaseUid();

    const nuevoId = this.generarId();
    const ahora = new Date().toISOString();
    
    const nuevoEntrenamiento: Entrenamiento = {
      ...entrenamiento,
      id: nuevoId,
      fechaCreacion: new Date(ahora),
      fechaModificacion: new Date(ahora)
    };

    const entrenamientoRef = ref(this.db, `usuarios/${uid}/entrenamientos/${nuevoId}`);
    await set(entrenamientoRef, {
      ...nuevoEntrenamiento,
      fechaCreacion: ahora,
      fechaModificacion: ahora
    });

    this.entrenamientosSubject.next([
      ...this.entrenamientosSubject.value,
      nuevoEntrenamiento
    ]);

    return nuevoId;
  }

  /**
   * Actualizar entrenamiento
   */
  async actualizarEntrenamiento(id: number, cambios: Partial<Entrenamiento>): Promise<void> {
    const uid = await this.getFirebaseUid();

    const ahora = new Date().toISOString();
    const updateData = {
      ...cambios,
      fechaModificacion: ahora
    };

    // Eliminar propiedades de fecha si existen para evitar conflictos
    delete (updateData as any).fechaCreacion;

    const entrenamientoRef = ref(this.db, `usuarios/${uid}/entrenamientos/${id}`);
    await update(entrenamientoRef, updateData);

    this.entrenamientosSubject.next(
      this.entrenamientosSubject.value.map(entrenamiento =>
        entrenamiento.id === id
          ? {
              ...entrenamiento,
              ...cambios,
              fechaModificacion: new Date(ahora)
            }
          : entrenamiento
      )
    );
  }

  /**
   * Eliminar entrenamiento
   */
  async eliminarEntrenamiento(id: number): Promise<void> {
    const uid = await this.getFirebaseUid();

    const entrenamientoRef = ref(this.db, `usuarios/${uid}/entrenamientos/${id}`);
    await remove(entrenamientoRef);

    this.entrenamientosSubject.next(
      this.entrenamientosSubject.value.filter(entrenamiento => entrenamiento.id !== id)
    );
  }

  /**
   * Agregar ejercicio a entrenamiento
   */
  agregarEjercicioAlEntrenamiento(entrenamientoId: number, ejercicio: EntrenamientoEjercicio): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const ahora = new Date().toISOString();
    const entrenamientosRef = ref(this.db, `usuarios/${uid}/entrenamientos/${entrenamientoId}`);
    
    return get(entrenamientosRef).then(snapshot => {
      if (snapshot.exists()) {
        const entrenamiento = snapshot.val();
        const ejercicios = entrenamiento.ejercicios || [];
        ejercicios.push(ejercicio);
        
        return update(entrenamientosRef, {
          ejercicios,
          fechaModificacion: ahora
        });
      }
      return Promise.resolve();
    });
  }

  /**
   * Remover ejercicio del entrenamiento
   */
  removerEjercicioDelEntrenamiento(entrenamientoId: number, ejercicioId: number): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      return Promise.reject('Usuario no autenticado');
    }

    const ahora = new Date().toISOString();
    const entrenamientosRef = ref(this.db, `usuarios/${uid}/entrenamientos/${entrenamientoId}`);
    
    return get(entrenamientosRef).then(snapshot => {
      if (snapshot.exists()) {
        const entrenamiento = snapshot.val();
        const ejercicios = (entrenamiento.ejercicios || []).filter((ej: any) => ej.id !== ejercicioId);
        
        return update(entrenamientosRef, {
          ejercicios,
          fechaModificacion: ahora
        });
      }
      return Promise.resolve();
    });
  }

  /**
   * Obtener Firebase UID del usuario actual
   */
  private getFirebaseUid(): Promise<string> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        unsubscribe();
        if (user) {
          resolve(user.uid);
        } else {
          reject('Usuario no autenticado');
        }
      });
    });
  }

  /**
   * Generar ID único
   */
  private generarId(): number {
    return Date.now();
  }
}
