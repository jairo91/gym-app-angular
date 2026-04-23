# Integración Firebase - Gym App

## 📚 Estructura de Datos Firebase

### Base de Datos: Firebase Realtime Database (Gratuito)

```
usuarios/
  {uid}/
    entrenamientos/
      {id}
        - nombre
        - descripcion
        - ejercicios[]
        - fechaCreacion
        - fechaModificacion
    
    rutinas/
      {fecha}
        - entrenamientoId
        - series[]
        - notas
        - fechaActualizacion
    
    historial/
      {id}
        - ejercicioId
        - nombreEjercicio
        - fecha
        - peso
        - repeticiones
        - series
        - notas
    
    historial-ejercicios/
      {ejercicioId}/
        {timestamp}
          - datos del registro

ejercicios-disponibles/
  {id}
    - nombre
    - imagen
    - pesoMaximo
    - unidad
    - fechaUltimo
    - series
```

## 🔐 Configuración de Reglas de Seguridad

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Realtime Database → Rules
4. Copia el contenido de `firebase-rules.json`

**Reglas instaladas:**
- ✅ Cada usuario solo puede leer/escribir sus propios datos
- ✅ Los ejercicios disponibles solo se pueden leer (data compartida)
- ✅ Validación de estructura de datos

## 📦 Servicios Firebase Disponibles

### 1. `FirebaseEntrenamientoService`
Gestión completa de entrenamientos personalizados.

```typescript
// Obtener todos los entrenamientos en tiempo real
this.entrenamientoService.getEntrenamientos$().subscribe(entrenamientos => {
  console.log(entrenamientos);
});

// Crear nuevo entrenamiento
this.entrenamientoService.crearEntrenamiento({
  nombre: 'Tren Superior',
  descripcion: 'Enfoque en pecho y espalda',
  ejercicios: []
}).then(id => console.log('Creado:', id));

// Actualizar
this.entrenamientoService.actualizarEntrenamiento(1, {
  nombre: 'Tren Superior - Modificado'
});

// Eliminar
this.entrenamientoService.eliminarEntrenamiento(1);
```

### 2. `FirebaseExerciseService`
Gestión de ejercicios disponibles e historial.

```typescript
// Obtener ejercicios disponibles
this.exerciseService.getEjerciciosDisponibles$().subscribe(ejercicios => {
  console.log(ejercicios);
});

// Agregar al historial
this.exerciseService.agregarAlHistorial(1, {
  peso: 100,
  repeticiones: 10,
  fecha: new Date().toISOString()
});

// Obtener historial de un ejercicio
this.exerciseService.getHistorialEjercicio$(1).subscribe(historial => {
  console.log(historial);
});
```

### 3. `FirebaseRutinaService`
Planificación diaria de entrenamientos.

```typescript
// Obtener rutinas en tiempo real
this.rutinaService.getRutinas$().subscribe(rutinas => {
  console.log(rutinas);
});

// Guardar rutina de un día
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
    }
  ]
});

// Obtener rutina de una fecha específica
this.rutinaService.getRutinaPorFecha$('2026-04-22').subscribe(rutina => {
  console.log(rutina);
});
```

### 4. `FirebaseHistorialService`
Historial completo de ejercicios realizados.

```typescript
// Obtener historial completo
this.historialService.getHistorial$().subscribe(historial => {
  console.log(historial);
});

// Agregar registro
this.historialService.agregarAlHistorial({
  ejercicioId: 1,
  nombreEjercicio: 'Press de Banca',
  peso: 100,
  repeticiones: 10,
  series: 4
});

// Obtener estadísticas de un ejercicio
this.historialService.getEstadisticasEjercicio$(1).subscribe(stats => {
  console.log('Peso máximo:', stats?.pesoMaximo);
  console.log('Peso promedio:', stats?.pesoPromedio);
});
```

## 🔄 Sincronización en Tiempo Real

Todos los servicios están configurados para sincronización automática:

- **Entrenamientos**: Se actualizan en tiempo real cuando cambian
- **Rutinas**: Los cambios se guardan y sincronizan inmediatamente
- **Historial**: Los registros se agregan y se refleja en toda la app
- **Ejercicios**: Se cargan una vez al inicializar (datos compartidos)

## 🚀 Migración de Datos

Para migrar de localStorage a Firebase:

1. Los servicios de Firebase funcionan en paralelo
2. Puedes copiar datos de localStorage a Firebase
3. Una vez verificado, desactiva localStorage

**Script de migración:**
```typescript
// En tu componente
import { EntrenamientoService } from './services/entrenamiento.service';
import { FirebaseEntrenamientoService } from './services/firebase-entrenamiento.service';

constructor(
  private localService: EntrenamientoService,
  private firebaseService: FirebaseEntrenamientoService
) {}

migrateData() {
  const entrenamientos = this.localService.getEntrenamientos();
  entrenamientos.forEach(ent => {
    this.firebaseService.crearEntrenamiento({
      nombre: ent.nombre,
      descripcion: ent.descripcion,
      ejercicios: ent.ejercicios
    });
  });
}
```

## ✅ Próximos Pasos

1. **Actualizar Componentes**: Cambiar de `EntrenamientoService` a `FirebaseEntrenamientoService`
2. **Usar Observables**: Reemplazar subscripciones síncronas por `async pipe`
3. **Eliminar localStorage**: Una vez confirmado que Firebase funciona
4. **Agregar indicadores de sincronización**: Mostrar estado de carga

## 📱 Ventajas de Firebase

✅ **Gratuito**: Realtime Database tiene tier gratuito generoso
✅ **Tiempo Real**: Los cambios se sincronizan automáticamente
✅ **Seguridad**: Autenticación integrada con reglas de acceso
✅ **Escalable**: Crece con tus necesidades
✅ **Confiable**: Infraestructura de Google

## 🐛 Troubleshooting

### "Usuario no autenticado"
- Asegúrate de que el usuario está logueado antes de usar los servicios
- Verifica que `Auth.currentUser` no es null

### Los datos no se sincronizan
- Revisa las reglas de seguridad en Firebase Console
- Verifica que el usuario tiene permisos de lectura/escritura
- Abre la consola del navegador para ver errores

### Performance lenta
- Usa índices en Firebase para queries frecuentes
- Limita el número de observables activos
- Implementa paginación para grandes conjuntos de datos
