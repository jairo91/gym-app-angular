
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseHistorialService } from '../../services/firebase-historial.service';
import { EntrenamientoService } from '../../services/entrenamiento.service';
import { HistorialEjercicio } from '../../models/historial/historial-ejercicio.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend, Filler } from 'chart.js';

// Registrar elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EjercicioAgrupado {
  id: number;
  nombre: string;
  imagen?: string;
  pesoMaximo: number;
  totalRegistros: number;
  fechaUltimo: string;
  registros: HistorialEjercicio[];
}

@Component({
  selector: 'app-historial',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  ejercicios$!: Observable<EjercicioAgrupado[]>;
  selectedExercise: EjercicioAgrupado | null = null;
  showDetails = false;
  private ejerciciosDisponibles: any[] = [];
  
  // Gráfica
  chartData: any = null;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#666',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: '#666' },
        grid: { color: '#eee' }
      },
      x: {
        ticks: { color: '#666' },
        grid: { color: '#eee' }
      }
    }
  };

  constructor(
    private firebaseHistorial: FirebaseHistorialService,
    private entrenamientoService: EntrenamientoService,
    private cdr: ChangeDetectorRef
  ) {
    this.ejerciciosDisponibles = this.entrenamientoService.getEjerciciosDisponibles();
  }

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
        // Obtener imagen del registro o buscar en ejercicios disponibles
        let imagen = registro.imagenEjercicio;
        if (!imagen) {
          const ejercicioDisponible = this.ejerciciosDisponibles.find(e => e.id === id);
          imagen = ejercicioDisponible?.imagen;
        }

        mapa.set(id, {
          id: id,
          nombre: registro.nombreEjercicio,
          imagen: imagen,
          pesoMaximo: 0,
          totalRegistros: 0,
          fechaUltimo: '',
          registros: []
        });
      }

      // Calcular repeticionesPorSerie si no existe
      if (!registro.repeticionesPorSerie && registro.notas) {
        registro.repeticionesPorSerie = this.extraerRepeticionesDeLasNotas(registro.notas);
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

  private extraerRepeticionesDeLasNotas(notas: string): string {
    // Formato esperado: "Entrenamiento X — 10x56kg, 10x50kg"
    // Extraer todos los números antes de "x"
    const regex = /(\d+)x/g;
    const matches: string[] = [];
    let match;
    
    while ((match = regex.exec(notas)) !== null) {
      matches.push(match[1]);
    }
    
    return matches.length > 0 ? matches.join('/') : '';
  }

  private generarGrafica() {
    if (!this.selectedExercise || !this.selectedExercise.registros || this.selectedExercise.registros.length === 0) {
      console.warn('No hay registros para mostrar gráfica');
      return;
    }

    // Ordenar registros por fecha
    const registrosOrdenados = [...this.selectedExercise.registros].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    // Preparar datos para la gráfica
    const fechas = registrosOrdenados.map(r => {
      const fecha = new Date(r.fecha);
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    });

    const pesos: number[] = registrosOrdenados.map(r => Number(r.peso));

    console.log('Generando gráfica con datos:', { fechas, pesos });

    this.chartData = {
      labels: fechas,
      datasets: [
        {
          label: 'Peso Máximo (kg)',
          data: pesos,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7
        }
      ]
    };

    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Actualizar gráfica si existe
    if (this.chart) {
      this.chart.chart?.update();
    }
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
    // Generar gráfica después de mostrar el modal
    setTimeout(() => {
      this.generarGrafica();
      this.cdr.detectChanges();
    }, 150);
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
