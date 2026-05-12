import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get, set } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  private readonly ADMIN_EMAIL = 'jairomendezusa@gmail.com';

  constructor(private auth: Auth, private db: Database) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.checkAdminStatus(user.uid, user.email);
      } else {
        this.isAdminSubject.next(false);
      }
    });
  }

  private async checkAdminStatus(uid: string, email: string | null): Promise<void> {
    // Verificar si el email es el del administrador
    if (email === this.ADMIN_EMAIL) {
      this.isAdminSubject.next(true);
      return;
    }
    
    // También verificar en la base de datos en caso de que se agreguen más admins
    try {
      const adminRef = ref(this.db, `admins/${uid}`);
      const snapshot = await get(adminRef);
      this.isAdminSubject.next(snapshot.exists());
    } catch (error) {
      console.error('Error checking admin status:', error);
      this.isAdminSubject.next(false);
    }
  }

  isCurrentUserAdmin(): Observable<boolean> {
    return this.isAdmin$;
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }
}
