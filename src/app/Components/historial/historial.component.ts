
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseHistorialService } from '../../services/firebase-historial.service';
import { HistorialEjercicio } from '../../models/historial/historial-ejercicio.model';
import { Component, OnInit } from '@angular/core';

interface EjercicioAgrupado {
  id: number;
  nombre: string;
  pesoMaximo: number;
  totalRegistros: number;
  fechaUltimo: string;
  registros: HistorialEjercicio[];
}

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  ejercicios$!: Observable<EjercicioAgrupado[]>;
  selectedExercise: EjercicioAgrupado | null = null;
  showDetails = false;

  constructor(private firebaseHistorial: FirebaseHistorialService) {}

  ngOnInit() {
    const historialCompleto$ = this.firebaseHistorial.getHistorial$();
    this.ejercicios$ = historialCompleto$.pipe(
      map(historial => this.agruparEjerciciosPorNombre(historial))
    );
  }

  private agruparEjerciciosPorNombre(historial: HistorialEjercicio[]): EjercicioAgrupado[] {
    const mapa = new Map<number, EjercicioAgrupado>();

    historial.forEach(registro => {
      const id = registro.ejercicioId;

      if (!mapa.has(id)) {
        mapa.set(id, {
          id: id,
          nombre: registro.nombreEjercicio,
          pesoMaximo: 0,
          totalRegistros: 0,
          fechaUltimo: '',
          registros: []
        });
      }

      const ejercicio = mapa.get(id)!;
      ejercicio.registros.push(registro);
      ejercicio.totalRegistros++;

      if (registro.peso > ejercicio.pesoMaximo) {
        ejercicio.pesoMaximo = registro.peso;
      }

      if (!ejercicio.fechaUltimo || new Date(registro.fecha) > new Date(ejercicio.fechaUltimo)) {
        ejercicio.fechaUltimo = this.formatearFecha(registro.fecha);
      }
    });

    return Array.from(mapa.values()).sort((a, b) =>
      new Date(b.registros[0]?.fecha || 0).getTime() - new Date(a.registros[0]?.fecha || 0).getTime()
    );
  }

  private formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const year = fecha.getFullYear();
    return `${dia}/${mes}/${year}`;
  }

  verHistorial(ejercicio: EjercicioAgrupado) {
    this.selectedExercise = ejercicio;
    this.showDetails = true;
  }

  cerrarDetalle() {
    this.showDetails = false;
    this.selectedExercise = null;
  }
  eliminarRegistro(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) { 
      this.firebaseHistorial.eliminarRegistro(id).catch(error => {
        alert('Error al eliminar: ' + error);
      });
    }
  }

  actualizarRegistro(id: string, cambios: Partial<HistorialEjercicio>) {
    this.firebaseHistorial.actualizarRegistro(id, cambios).catch(error => {
      alert('Error al actualizar: ' + error);
    });   
  }
}
