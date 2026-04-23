# 📖 Referencia Rápida - Firebase Services

## Índice Rápido

- [FirebaseEntrenamientoService](#firebaseentrenamientoservice)
- [FirebaseExerciseService](#firebaseexerciseservice)
- [FirebaseRutinaService](#firebaseruntimeservice)
- [FirebaseHistorialService](#firebasehistorialservice)

---

## FirebaseEntrenamientoService

**Ubicación:** `src/app/services/firebase-entrenamiento.service.ts`

**Inyectar:**
```typescript
constructor(private entrenamientoService: FirebaseEntrenamientoService) {}
```

### Métodos

#### `getEntrenamientos$(): Observable<Entrenamiento[]>`
Obtiene todos los entrenamientos en tiempo real.
```typescript
this.entrenamientoService.getEntrenamientos$().subscribe(entrenamientos => {
  console.log(entrenamientos);
});

// En template con async pipe:
<div *ngFor="let ent of entrenamientos$ | async">{{ ent.nombre }}</div>
```

**Retorna:** Observable de array de entrenamientos
**Uso en template:** `entrenamientos$ | async`

---

#### `getEntrenamientoById$(id: number): Observable<Entrenamiento | null>`
Obtiene un entrenamiento específico.
```typescript
this.entrenamientoService.getEntrenamientoById$(1).subscribe(entrenamiento => {
  if (entrenamiento) {
    console.log('Encontrado:', entrenamiento.nombre);
  }
});
```

**Parámetros:**
- `id`: número del entrenamiento

**Retorna:** Observable con el entrenamiento o null

---

#### `crearEntrenamiento(entrenamiento): Promise<number>`
Crear un nuevo entrenamiento.
```typescript
this.entrenamientoService.crearEntrenamiento({
  nombre: 'Tren Superior',
  descripcion: 'Pecho y espalda',
  ejercicios: [
    {
      id: 1,
      nombre: 'Press de Banca',
      imagen: 'https://...',
      seriesRecomendadas: 4,
      repeticionesRecomendadas: '8-10',
      pesoRecomendado: 100,
      notas: 'Forma importante'
    }
  ]
}).then(id => {
  console.log('Entrenamiento creado:', id);
}).catch(error => {
  console.error('Error:', error);
});
```

**Parámetros:**
```typescript
{
  nombre: string;           // Requerido
  descripcion: string;      // Requerido
  ejercicios: [{
    id: number;
    nombre: string;
    imagen: string;
    seriesRecomendadas: number;
    repeticionesRecomendadas: string;
    pesoRecomendado?: number;
    notas?: string;
  }];
}
```

**Retorna:** Promise con el ID generado

---

#### `actualizarEntrenamiento(id: number, cambios): Promise<void>`
Actualizar un entrenamiento existente.
```typescript
this.entrenamientoService.actualizarEntrenamiento(1, {
  nombre: 'Tren Superior - Modificado',
  descripcion: 'Pecho, espalda y hombros'
}).then(() => {
  console.log('Actualizado');
}).catch(error => {
  console.error('Error:', error);
});
```

**Parámetros:**
- `id`: número del entrenamiento
- `cambios`: objeto con propiedades a actualizar

**Retorna:** Promise<void>

---

#### `eliminarEntrenamiento(id: number): Promise<void>`
Eliminar un entrenamiento.
```typescript
if (confirm('¿Eliminar?')) {
  this.entrenamientoService.eliminarEntrenamiento(1)
    .then(() => console.log('Eliminado'))
    .catch(err => console.error(err));
}
```

**Parámetros:**
- `id`: número del entrenamiento

**Retorna:** Promise<void>

---

#### `agregarEjercicioAlEntrenamiento(entrenamientoId, ejercicio): Promise<void>`
Agregar un ejercicio a un entrenamiento.
```typescript
this.entrenamientoService.agregarEjercicioAlEntrenamiento(1, {
  id: 5,
  nombre: 'Dominadas',
  imagen: 'https://...',
  seriesRecomendadas: 3,
  repeticionesRecomendadas: '6-8'
}).then(() => console.log('Ejercicio agregado'));
```

---

#### `removerEjercicioDelEntrenamiento(entrenamientoId, ejercicioId): Promise<void>`
Remover un ejercicio de un entrenamiento.
```typescript
this.entrenamientoService.removerEjercicioDelEntrenamiento(1, 5)
  .then(() => console.log('Ejercicio removido'));
```

---

## FirebaseExerciseService

**Ubicación:** `src/app/services/firebase-exercise.service.ts`

**Inyectar:**
```typescript
constructor(private exerciseService: FirebaseExerciseService) {}
```

### Métodos

#### `getEjerciciosDisponibles$(): Observable<Exercise[]>`
Obtiene todos los ejercicios disponibles (compartidos).
```typescript
this.exerciseService.getEjerciciosDisponibles$().subscribe(ejercicios => {
  console.log(ejercicios);
});

// En componente
ejerciciosDisponibles$ = this.exerciseService.getEjerciciosDisponibles$();

// En template
<div *ngFor="let ej of ejerciciosDisponibles$ | async">{{ ej.nombre }}</div>
```

**Retorna:** Observable de array de ejercicios

---

#### `getEjercicioById$(id: number): Observable<Exercise | null>`
Obtiene un ejercicio específico.
```typescript
this.exerciseService.getEjercicioById$(1).subscribe(ejercicio => {
  if (ejercicio) {
    console.log('Peso máximo:', ejercicio.pesoMaximo);
  }
});
```

---

#### `agregarAlHistorial(ejercicioId, record): Promise<void>`
Agrega un registro al historial de un ejercicio.
```typescript
this.exerciseService.agregarAlHistorial(1, {
  peso: 100,
  repeticiones: 10,
  fecha: new Date().toISOString()
}).then(() => console.log('Agregado al historial'));
```

---

#### `getHistorialEjercicio$(ejercicioId: number): Observable<ExerciseHistory[]>`
Obtiene el historial de un ejercicio.
```typescript
this.exerciseService.getHistorialEjercicio$(1).subscribe(historial => {
  console.log('Registros:', historial);
});
```

---

#### `actualizarEjercicio(id: number, cambios): Promise<void>`
Actualizar datos de un ejercicio.
```typescript
this.exerciseService.actualizarEjercicio(1, {
  pesoMaximo: 110,
  fechaUltimo: new Date().toISOString()
}).then(() => console.log('Actualizado'));
```

---

## FirebaseRutinaService

**Ubicación:** `src/app/services/firebase-rutina.service.ts`

**Inyectar:**
```typescript
constructor(private rutinaService: FirebaseRutinaService) {}
```

### Métodos

#### `getRutinas$(): Observable<RutinaDia[]>`
Obtiene todas las rutinas en tiempo real.
```typescript
rutinas$ = this.rutinaService.getRutinas$();

// En template
<div *ngFor="let rutina of rutinas$ | async">
  {{ rutina.fecha }}: {{ rutina.entrenamientoId }}
</div>
```

---

#### `getRutinaPorFecha$(fecha: string): Observable<RutinaDia | null>`
Obtiene la rutina de una fecha específica.
```typescript
const fecha = '2026-04-22';
this.rutinaService.getRutinaPorFecha$(fecha).subscribe(rutina => {
  if (rutina) {
    console.log('Series:', rutina.series);
  }
});
```

**Parámetro:** fecha en formato `YYYY-MM-DD`

---

#### `guardarRutinaDia(fecha: string, rutina): Promise<void>`
Guardar o actualizar la rutina de un día.
```typescript
this.rutinaService.guardarRutinaDia('2026-04-22', {
  entrenamientoId: 1,
  series: [
    {
      ejercicioId: 1,
      nombreEjercicio: 'Press de Banca',
      numero: 1,
      peso: 100,
      repeticiones: 10,
      completada: false
    },
    {
      ejercicioId: 1,
      nombreEjercicio: 'Press de Banca',
      numero: 2,
      peso: 100,
      repeticiones: 8,
      completada: false
    }
  ],
  notas: 'Muy buena sesión'
}).then(() => console.log('Rutina guardada'));
```

---

#### `actualizarSeriesRutina(fecha: string, series): Promise<void>`
Actualizar solo las series de una rutina.
```typescript
this.rutinaService.actualizarSeriesRutina('2026-04-22', [
  { ejercicioId: 1, numero: 1, peso: 105, repeticiones: 10, completada: true },
  { ejercicioId: 1, numero: 2, peso: 105, repeticiones: 8, completada: true }
]).then(() => console.log('Series actualizadas'));
```

---

#### `marcarSerieCompletada(fecha: string, serieIndex: number, completada: boolean): Promise<void>`
Marcar una serie como completada.
```typescript
this.rutinaService.marcarSerieCompletada('2026-04-22', 0, true)
  .then(() => console.log('Serie marcada'));
```

---

#### `eliminarRutinaDia(fecha: string): Promise<void>`
Eliminar la rutina de un día.
```typescript
this.rutinaService.eliminarRutinaDia('2026-04-22')
  .then(() => console.log('Rutina eliminada'));
```

---

## FirebaseHistorialService

**Ubicación:** `src/app/services/firebase-historial.service.ts`

**Inyectar:**
```typescript
constructor(private historialService: FirebaseHistorialService) {}
```

### Métodos

#### `getHistorial$(): Observable<HistorialEjercicio[]>`
Obtiene todo el historial en tiempo real (ordenado por fecha descendente).
```typescript
historial$ = this.historialService.getHistorial$();

// En template
<div *ngFor="let registro of historial$ | async">
  {{ registro.nombreEjercicio }}: {{ registro.peso }} kg
</div>
```

---

#### `getHistorialEjercicio$(ejercicioId: number): Observable<HistorialEjercicio[]>`
Obtiene el historial de un ejercicio específico.
```typescript
this.historialService.getHistorialEjercicio$(1).subscribe(registros => {
  console.log('Registros del Press:', registros);
});
```

---

#### `agregarAlHistorial(registro): Promise<string>`
Agregar un nuevo registro al historial.
```typescript
this.historialService.agregarAlHistorial({
  ejercicioId: 1,
  nombreEjercicio: 'Press de Banca',
  peso: 100,
  repeticiones: 10,
  series: 4,
  notas: 'Con barra olímpica'
}).then(id => {
  console.log('Registro creado:', id);
});
```

**Parámetros:**
```typescript
{
  ejercicioId: number;
  nombreEjercicio: string;
  peso: number;
  repeticiones: number;
  series: number;
  notas?: string;
}
```

La fecha se agrega automáticamente.

---

#### `actualizarRegistro(id: string, cambios): Promise<void>`
Actualizar un registro existente.
```typescript
this.historialService.actualizarRegistro('1234567890', {
  peso: 105,
  notas: 'Muy fácil'
}).then(() => console.log('Actualizado'));
```

---

#### `eliminarRegistro(id: string): Promise<void>`
Eliminar un registro del historial.
```typescript
this.historialService.eliminarRegistro('1234567890')
  .then(() => console.log('Eliminado'));
```

---

#### `getEstadisticasEjercicio$(ejercicioId: number): Observable<Estadisticas | null>`
Obtener estadísticas de un ejercicio (peso máx, promedio, etc).
```typescript
this.historialService.getEstadisticasEjercicio$(1).subscribe(stats => {
  if (stats) {
    console.log('Peso máximo:', stats.pesoMaximo);
    console.log('Peso promedio:', stats.pesoPromedio);
    console.log('Total series:', stats.totalSeries);
    console.log('Última fecha:', stats.ultimaFecha);
  }
});
```

**Retorna:**
```typescript
{
  pesoMaximo: number;
  pesoPromedio: number;
  totalSeries: number;
  ultimaFecha: string;
} | null
```

---

## Patrones Comunes

### Patrón 1: Obtener datos y actualizar en tiempo real
```typescript
export class MiComponent {
  entrenamientos$ = this.service.getEntrenamientos$();
  
  constructor(private service: FirebaseEntrenamientoService) {}
  
  ngOnInit() {
    // Los datos se sincronizan automáticamente
  }
}
```

Template:
```html
<div *ngFor="let ent of entrenamientos$ | async">
  {{ ent.nombre }}
</div>
```

---

### Patrón 2: Guardar datos con manejo de errores
```typescript
guardar() {
  this.isLoading = true;
  this.errorMessage = '';
  
  this.service.crearEntrenamiento(data)
    .then(() => {
      this.isLoading = false;
      this.showSuccess = true;
    })
    .catch(error => {
      this.isLoading = false;
      this.errorMessage = 'Error: ' + error.message;
    });
}
```

---

### Patrón 3: Suscribirse a múltiples observables
```typescript
constructor(private entrenamientoService: FirebaseEntrenamientoService,
            private ejercicioService: FirebaseExerciseService) {}

ngOnInit() {
  combineLatest([
    this.entrenamientoService.getEntrenamientos$(),
    this.ejercicioService.getEjerciciosDisponibles$()
  ]).subscribe(([entrenamientos, ejercicios]) => {
    console.log('Datos cargados');
  });
}
```

Necesitas importar: `import { combineLatest } from 'rxjs';`

---

### Patrón 4: Filtrar datos en tiempo real
```typescript
export class MiComponent {
  miEjercicio$ = this.service.getEntrenamientos$().pipe(
    map(entrenamientos => 
      entrenamientos.filter(e => e.id === 1)
    )
  );
  
  constructor(private service: FirebaseEntrenamientoService) {}
}
```

Necesitas: `import { map } from 'rxjs/operators';`

---

## Interfaces de Datos

### Entrenamiento
```typescript
interface Entrenamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ejercicios: EntrenamientoEjercicio[];
  fechaCreacion: Date;
  fechaModificacion: Date;
}

interface EntrenamientoEjercicio {
  id: number;
  nombre: string;
  imagen: string;
  seriesRecomendadas: number;
  repeticionesRecomendadas: string;
  pesoRecomendado?: number;
  notas?: string;
}
```

### Exercise
```typescript
interface Exercise {
  id: number;
  nombre: string;
  imagen: string;
  pesoMaximo: number;
  unidad: string;
  fechaUltimo: string;
  series: number;
  historial?: ExerciseHistory[];
}
```

### RutinaDia
```typescript
interface RutinaDia {
  fecha: string;
  entrenamientoId: number;
  series: SeriePeso[];
  notas?: string;
}

interface SeriePeso {
  ejercicioId: number;
  nombreEjercicio: string;
  numero: number;
  peso: number;
  repeticiones: number;
  completada: boolean;
  notas?: string;
}
```

### HistorialEjercicio
```typescript
interface HistorialEjercicio {
  id: string;
  ejercicioId: number;
  nombreEjercicio: string;
  fecha: string;
  peso: number;
  repeticiones: number;
  series: number;
  notas?: string;
}
```

---

## Errores Comunes

### ❌ "Property 'firebaseEntrenamiento' is used before its initialization"
**Solución:** Inicializar observables en `ngOnInit`, no en la clase:
```typescript
// ❌ MALO
entrenamientos$ = this.service.getEntrenamientos$();

// ✅ BIEN
entrenamientos$!: Observable<Entrenamiento[]>;
ngOnInit() {
  this.entrenamientos$ = this.service.getEntrenamientos$();
}
```

### ❌ "Usuario no autenticado"
**Solución:** Verificar que hay usuario logueado:
```typescript
ngOnInit() {
  this.auth.onAuthStateChanged(user => {
    if (user) {
      // Ahora usar servicios Firebase
    }
  });
}
```

### ❌ "PERMISSION_DENIED"
**Solución:** Revisar reglas de seguridad en Firebase Console

### ❌ Los datos no se actualizan en el template
**Solución:** Usar `async pipe`:
```html
<!-- ❌ MALO -->
<div *ngFor="let ent of entrenamientos"></div>

<!-- ✅ BIEN -->
<div *ngFor="let ent of entrenamientos$ | async"></div>
```

---

## Tests Útiles

Después de implementar, verifica:
- [ ] `ng serve` sin errores
- [ ] Usuario puede iniciar sesión
- [ ] Crear entrenamiento → aparece en Firebase
- [ ] Editar entrenamiento → se actualiza en Firebase
- [ ] Eliminar entrenamiento → desaparece de Firebase
- [ ] Abrir en otra pestaña → ve cambios en tiempo real
- [ ] Recargar página → datos persisten

---

¡Listo! Ahora tienes la referencia completa. 📚
