import { Injectable } from '@angular/core';
import { Database, ref, get, set, remove, push, onValue, update } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise, GrupoMuscular } from '../models/exercise/exercise.model';

export interface GlobalExercise {
  id?: string;
  nombre: string;
  imagen: string;
  grupoMuscular: GrupoMuscular;
  descripcion?: string;
  createdAt?: number;
  updatedAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseExerciseManagementService {
  private globalExercisesSubject = new BehaviorSubject<GlobalExercise[]>([]);
  public globalExercises$ = this.globalExercisesSubject.asObservable();

  constructor(private db: Database) {
    this.loadGlobalExercises();
  }

  private loadGlobalExercises(): void {
    const exercisesRef = ref(this.db, 'ejercicios_globales');
    onValue(exercisesRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const exercises = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        this.globalExercisesSubject.next(exercises);
      } else {
        this.globalExercisesSubject.next([]);
      }
    });
  }

  getGlobalExercises(): Observable<GlobalExercise[]> {
    return this.globalExercises$;
  }

  async addGlobalExercise(exercise: Omit<GlobalExercise, 'id'>): Promise<string> {
    const exercisesRef = ref(this.db, 'ejercicios_globales');
    const newExerciseRef = push(exercisesRef);
    
    const exerciseData = {
      ...exercise,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await set(newExerciseRef, exerciseData);
    return newExerciseRef.key || '';
  }

  async updateGlobalExercise(id: string, exercise: Partial<GlobalExercise>): Promise<void> {
    const exerciseRef = ref(this.db, `ejercicios_globales/${id}`);
    const updateData = {
      ...exercise,
      updatedAt: Date.now()
    };
    return update(exerciseRef, updateData);
  }

  async deleteGlobalExercise(id: string): Promise<void> {
    const exerciseRef = ref(this.db, `ejercicios_globales/${id}`);
    return remove(exerciseRef);
  }

  async getGlobalExerciseById(id: string): Promise<GlobalExercise | null> {
    const exerciseRef = ref(this.db, `ejercicios_globales/${id}`);
    const snapshot = await get(exerciseRef);
    if (snapshot.exists()) {
      return { id, ...snapshot.val() };
    }
    return null;
  }
}
