import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        subscriber.next(user);
      });
      return unsubscribe;
    });
  }
}
