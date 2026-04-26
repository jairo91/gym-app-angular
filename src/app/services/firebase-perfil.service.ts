import { Injectable } from '@angular/core';
import { Database, ref, get, set, onValue } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

export interface UserProfile {
  nombre: string;
  edad: number | null;
  altura: number | null;
  peso: number | null;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebasePerfilService {
  private perfilSubject = new BehaviorSubject<UserProfile | null>(null);
  public perfil$ = this.perfilSubject.asObservable();

  constructor(private db: Database, private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        const perfilRef = ref(this.db, `usuarios/${user.uid}/perfil`);
        onValue(perfilRef, snapshot => {
          if (snapshot.exists()) {
            this.perfilSubject.next({ ...snapshot.val(), email: user.email || '' });
          } else {
            this.perfilSubject.next({
              nombre: user.displayName || '',
              edad: null,
              altura: null,
              peso: null,
              email: user.email || ''
            });
          }
        });
      } else {
        this.perfilSubject.next(null);
      }
    });
  }

  guardarPerfil(perfil: Omit<UserProfile, 'email'>): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return Promise.reject('Usuario no autenticado');
    const perfilRef = ref(this.db, `usuarios/${uid}/perfil`);
    return set(perfilRef, perfil);
  }
}
