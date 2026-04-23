import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebasePerfilService, UserProfile } from '../../services/firebase-perfil.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {
  perfil: UserProfile = { nombre: '', edad: null, altura: null, peso: null, email: '' };
  editando = false;
  isSaving = false;
  message = '';
  isError = false;
  resetSent = false;
  private sub?: Subscription;

  constructor(
    private firebasePerfil: FirebasePerfilService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sub = this.firebasePerfil.perfil$.subscribe(p => {
      if (p) this.perfil = { ...p };
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get imc(): number | null {
    if (!this.perfil.peso || !this.perfil.altura) return null;
    const alturaM = this.perfil.altura / 100;
    return Math.round((this.perfil.peso / (alturaM * alturaM)) * 10) / 10;
  }

  get imcCategoria(): string {
    const v = this.imc;
    if (v === null) return '';
    if (v < 18.5) return 'Bajo peso';
    if (v < 25) return 'Normal';
    if (v < 30) return 'Sobrepeso';
    return 'Obesidad';
  }

  activarEdicion() {
    this.editando = true;
    this.message = '';
  }

  cancelarEdicion() {
    this.editando = false;
    // Recargar datos originales
    this.firebasePerfil.perfil$.subscribe(p => { if (p) this.perfil = { ...p }; }).unsubscribe();
  }

  async guardarPerfil() {
    this.isSaving = true;
    this.message = '';
    try {
      await this.firebasePerfil.guardarPerfil({
        nombre: this.perfil.nombre,
        edad: this.perfil.edad,
        altura: this.perfil.altura,
        peso: this.perfil.peso
      });
      this.message = '\u2705 Perfil guardado correctamente';
      this.isError = false;
      this.editando = false;
    } catch (e: any) {
      this.message = '\u274c Error al guardar: ' + (e?.message || e);
      this.isError = true;
    } finally {
      this.isSaving = false;
      setTimeout(() => (this.message = ''), 4000);
    }
  }

  async resetearContrasena() {
    if (!this.perfil.email) return;
    try {
      await this.authService.resetPassword(this.perfil.email);
      this.resetSent = true;
      this.message = `\u2705 Correo de recuperaci\u00f3n enviado a ${this.perfil.email}`;
      this.isError = false;
    } catch (e: any) {
      this.message = '\u274c Error: ' + (e?.message || e);
      this.isError = true;
    } finally {
      setTimeout(() => (this.message = ''), 6000);
    }
  }
}
