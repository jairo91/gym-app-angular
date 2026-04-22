import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/exercise/exercise.model';
import { ExerciseHistory } from '../../models/exercise/exercise-history.model';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  exercises: Exercise[] = [];
  selectedExercise: Exercise | null = null;
  showDetails = false;

  constructor() {
    this.loadExercises();
  }

  loadExercises() {
    this.exercises = [
      {
        id: 1,
        nombre: 'Press de Banca',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 100,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        historial: [
          {
            fecha: '20/04/2026',
            series: [
              { repeticiones: 8, peso: 80, unidad: 'kg' },
              { repeticiones: 10, peso: 75, unidad: 'kg' },
              { repeticiones: 12, peso: 70, unidad: 'kg' }
            ]
          },
          {
            fecha: '18/04/2026',
            series: [
              { repeticiones: 8, peso: 85, unidad: 'kg' },
              { repeticiones: 8, peso: 80, unidad: 'kg' },
              { repeticiones: 10, peso: 75, unidad: 'kg' }
            ]
          },
          {
            fecha: '15/04/2026',
            series: [
              { repeticiones: 6, peso: 90, unidad: 'kg' },
              { repeticiones: 8, peso: 85, unidad: 'kg' },
              { repeticiones: 8, peso: 80, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 2,
        nombre: 'Bíceps con Mancuernas',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 30,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        historial: [
          {
            fecha: '19/04/2026',
            series: [
              { repeticiones: 12, peso: 25, unidad: 'kg' },
              { repeticiones: 10, peso: 30, unidad: 'kg' },
              { repeticiones: 8, peso: 25, unidad: 'kg' }
            ]
          },
          {
            fecha: '17/04/2026',
            series: [
              { repeticiones: 12, peso: 20, unidad: 'kg' },
              { repeticiones: 12, peso: 25, unidad: 'kg' },
              { repeticiones: 10, peso: 20, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 3,
        nombre: 'Peso Muerto',
        imagen: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=300&h=200&fit=crop',
        pesoMaximo: 150,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        historial: [
          {
            fecha: '21/04/2026',
            series: [
              { repeticiones: 5, peso: 140, unidad: 'kg' },
              { repeticiones: 5, peso: 130, unidad: 'kg' },
              { repeticiones: 8, peso: 120, unidad: 'kg' }
            ]
          },
          {
            fecha: '19/04/2026',
            series: [
              { repeticiones: 5, peso: 135, unidad: 'kg' },
              { repeticiones: 5, peso: 125, unidad: 'kg' },
              { repeticiones: 8, peso: 115, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 4,
        nombre: 'Sentadilla',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 120,
        unidad: 'kg',
        fechaUltimo: '2026-04-20',
        series: 4,
        historial: [
          {
            fecha: '20/04/2026',
            series: [
              { repeticiones: 8, peso: 100, unidad: 'kg' },
              { repeticiones: 8, peso: 90, unidad: 'kg' },
              { repeticiones: 10, peso: 80, unidad: 'kg' },
              { repeticiones: 12, peso: 70, unidad: 'kg' }
            ]
          },
          {
            fecha: '18/04/2026',
            series: [
              { repeticiones: 6, peso: 110, unidad: 'kg' },
              { repeticiones: 8, peso: 100, unidad: 'kg' },
              { repeticiones: 8, peso: 90, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 5,
        nombre: 'Dominadas',
        imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
        pesoMaximo: 80,
        unidad: 'kg',
        fechaUltimo: '2026-04-18',
        series: 3,
        historial: [
          {
            fecha: '18/04/2026',
            series: [
              { repeticiones: 8, peso: 70, unidad: 'kg' },
              { repeticiones: 6, peso: 75, unidad: 'kg' },
              { repeticiones: 5, peso: 80, unidad: 'kg' }
            ]
          },
          {
            fecha: '16/04/2026',
            series: [
              { repeticiones: 10, peso: 65, unidad: 'kg' },
              { repeticiones: 8, peso: 70, unidad: 'kg' },
              { repeticiones: 6, peso: 75, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 6,
        nombre: 'Remo con Barra',
        imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        pesoMaximo: 110,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 4,
        historial: [
          {
            fecha: '21/04/2026',
            series: [
              { repeticiones: 10, peso: 90, unidad: 'kg' },
              { repeticiones: 10, peso: 85, unidad: 'kg' },
              { repeticiones: 12, peso: 80, unidad: 'kg' },
              { repeticiones: 15, peso: 70, unidad: 'kg' }
            ]
          },
          {
            fecha: '19/04/2026',
            series: [
              { repeticiones: 8, peso: 95, unidad: 'kg' },
              { repeticiones: 10, peso: 90, unidad: 'kg' },
              { repeticiones: 10, peso: 85, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 7,
        nombre: 'Press Militar',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        pesoMaximo: 60,
        unidad: 'kg',
        fechaUltimo: '2026-04-19',
        series: 3,
        historial: [
          {
            fecha: '19/04/2026',
            series: [
              { repeticiones: 8, peso: 50, unidad: 'kg' },
              { repeticiones: 10, peso: 45, unidad: 'kg' },
              { repeticiones: 12, peso: 40, unidad: 'kg' }
            ]
          },
          {
            fecha: '17/04/2026',
            series: [
              { repeticiones: 6, peso: 55, unidad: 'kg' },
              { repeticiones: 8, peso: 50, unidad: 'kg' },
              { repeticiones: 8, peso: 45, unidad: 'kg' }
            ]
          }
        ]
      },
      {
        id: 8,
        nombre: 'Flexiones',
        imagen: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
        pesoMaximo: 50,
        unidad: 'kg',
        fechaUltimo: '2026-04-21',
        series: 3,
        historial: [
          {
            fecha: '21/04/2026',
            series: [
              { repeticiones: 15, peso: 40, unidad: 'kg' },
              { repeticiones: 12, peso: 45, unidad: 'kg' },
              { repeticiones: 10, peso: 50, unidad: 'kg' }
            ]
          },
          {
            fecha: '19/04/2026',
            series: [
              { repeticiones: 20, peso: 35, unidad: 'kg' },
              { repeticiones: 15, peso: 40, unidad: 'kg' },
              { repeticiones: 12, peso: 45, unidad: 'kg' }
            ]
          }
        ]
      }
    ];
  }

  verHistorial(exercise: Exercise) {
    this.selectedExercise = exercise;
    this.showDetails = true;
  }

  cerrarDetalle() {
    this.showDetails = false;
    this.selectedExercise = null;
  }

  // Métodos helper para formatear datos en la tabla
  getSeriesCount(historial: ExerciseHistory): number {
    return historial.series.length;
  }

  getRepeticionesString(historial: ExerciseHistory): string {
    return historial.series.map(serie => serie.repeticiones).join('/');
  }

  getPesosString(historial: ExerciseHistory): string {
    return historial.series.map(serie => `${serie.peso}${serie.unidad}`).join('/');
  }
}

