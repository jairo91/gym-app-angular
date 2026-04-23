# 🔥 Guía de Configuración Firebase - Gym App

## ✅ Lo que ya está implementado

He creado 4 servicios Firebase completamente funcionales:

1. **FirebaseEntrenamientoService** - Gestión de entrenamientos personalizados
2. **FirebaseExerciseService** - Ejercicios disponibles e historial
3. **FirebaseRutinaService** - Planificación diaria de entrenamientos  
4. **FirebaseHistorialService** - Historial completo de ejercicios realizados

## 🚀 Próximos Pasos

### Paso 1: Configurar Reglas de Seguridad en Firebase Console

1. Accede a [Firebase Console](https://console.firebase.google.com)
2. Selecciona el proyecto `gym-app-a1964`
3. Ve a **Realtime Database** → **Rules**
4. Reemplaza las reglas actuales con el contenido de `firebase-rules.json`:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid",
        "entrenamientos": {
          ".validate": "newData.hasChildren(['nombre', 'descripcion', 'ejercicios', 'id', 'fechaCreacion', 'fechaModificacion'])"
        },
        "rutinas": {
          ".validate": "newData.hasChildren(['entrenamientoId', 'series'])"
        },
        "historial": {
          ".validate": "newData.hasChildren(['ejercicioId', 'nombreEjercicio', 'fecha', 'peso', 'repeticiones', 'series'])"
        },
        "historial-ejercicios": {
          ".validate": "newData.isObject() || newData.val() === null"
        }
      }
    },
    "ejercicios-disponibles": {
      ".read": true,
      ".write": false,
      ".validate": "newData.hasChildren(['nombre', 'imagen', 'pesoMaximo', 'unidad'])"
    }
  }
}
```

5. Haz clic en **Publicar**

### Paso 2: Habilitar Realtime Database

1. En Firebase Console, ve a **Realtime Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Iniciar en modo de prueba** (para desarrollo)
4. Selecciona la región más cercana a ti
5. Haz clic en **Habilitar**

**Nota:** El modo de prueba NO es seguro para producción. Cambiarás a las reglas del Paso 1 después.

### Paso 3: Actualizar Componentes a Firebase (OPCIONAL - Ya está hecho para entrenamientos)

El componente `entrenamientos.component.ts` ya está actualizado para usar Firebase.

Para otros componentes, usa este patrón:

```typescript
import { FirebaseRutinaService } from '../../services/firebase-rutina.service';

export class RutinaComponent implements OnInit {
  rutinas$ = this.rutinaService.getRutinas$();
  
  constructor(private rutinaService: FirebaseRutinaService) {}
  
  ngOnInit() {
    // Los datos se sincronizan automáticamente
  }
}
```

En el template, usa `async pipe`:

```html
<div *ngFor="let rutina of rutinas$ | async">
  {{ rutina.nombre }}
</div>
```

### Paso 4: Migración de Datos (OPCIONAL)

Si quieres copiar datos existentes de localStorage a Firebase:

```typescript
// En consola del navegador (F12) después de iniciar sesión:
const localStorageData = localStorage.getItem('entrenamientos');
if (localStorageData) {
  const entrenamientos = JSON.parse(localStorageData);
  entrenamientos.forEach(ent => {
    firebase.database().ref(`usuarios/${firebase.auth().currentUser.uid}/entrenamientos/${ent.id}`).set(ent);
  });
}
```

## 📊 Estructura de Datos en Firebase

### Entrenamientos
```
usuarios/
  {uid}/
    entrenamientos/
      {id}
        nombre: "Tren Superior"
        descripcion: "Pecho y espalda"
        ejercicios: [
          {
            id: 1,
            nombre: "Press de Banca",
            imagen: "...",
            seriesRecomendadas: 4,
            repeticionesRecomendadas: "8-10",
            pesoRecomendado: 100,
            notas: ""
          }
        ]
        fechaCreacion: "2026-04-22T..."
        fechaModificacion: "2026-04-22T..."
```

### Rutinas (Planificación Diaria)
```
usuarios/
  {uid}/
    rutinas/
      "2026-04-22"
        entrenamientoId: 1
        series: [
          {
            ejercicioId: 1,
            nombreEjercicio: "Press de Banca",
            numero: 1,
            peso: 100,
            repeticiones: 10,
            completada: false,
            notas: ""
          }
        ]
        notas: ""
        fechaActualizacion: "2026-04-22T..."
```

### Historial
```
usuarios/
  {uid}/
    historial/
      {id}
        ejercicioId: 1
        nombreEjercicio: "Press de Banca"
        fecha: "2026-04-22T..."
        peso: 100
        repeticiones: 10
        series: 4
        notas: "Fácil"
```

## 💡 Ejemplos de Uso

### Crear un Entrenamiento
```typescript
this.entrenamientoService.crearEntrenamiento({
  nombre: 'Full Body',
  descripcion: 'Cuerpo completo',
  ejercicios: [
    {
      id: 1,
      nombre: 'Press de Banca',
      imagen: '...',
      seriesRecomendadas: 4,
      repeticionesRecomendadas: '8-10'
    }
  ]
}).then(id => console.log('Creado:', id))
  .catch(err => console.error(err));
```

### Obtener Entrenamientos en Tiempo Real
```typescript
this.entrenamientoService.getEntrenamientos$().subscribe(entrenamientos => {
  console.log('Entrenamientos actualizados:', entrenamientos);
});
```

### Guardar Rutina de un Día
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
    }
  ]
}).then(() => console.log('Rutina guardada'))
  .catch(err => console.error(err));
```

### Agregar Registro al Historial
```typescript
this.historialService.agregarAlHistorial({
  ejercicioId: 1,
  nombreEjercicio: 'Press de Banca',
  peso: 100,
  repeticiones: 10,
  series: 4
}).then(id => console.log('Registro agregado:', id))
  .catch(err => console.error(err));
```

### Obtener Estadísticas
```typescript
this.historialService.getEstadisticasEjercicio$(1).subscribe(stats => {
  if (stats) {
    console.log('Peso máximo:', stats.pesoMaximo);
    console.log('Peso promedio:', stats.pesoPromedio);
    console.log('Total series:', stats.totalSeries);
  }
});
```

## 🔐 Reglas de Seguridad Explicadas

```
usuarios/$uid:
  - Solo el usuario autenticado puede leer/escribir sus datos
  - $uid = ID único del usuario autenticado

ejercicios-disponibles:
  - Todos pueden leer (es data compartida)
  - Nadie puede escribir (controlada por el equipo)
```

## ⚠️ Cambiar de Desarrollo a Producción

Cuando la app esté lista:

1. En Firebase Console → **Realtime Database** → **Rules**
2. Reemplaza las reglas con las del archivo `firebase-rules.json`
3. Haz clic en **Publicar**
4. Elimina datos de prueba si es necesario

## 🐛 Solucionar Problemas

### "Usuario no autenticado"
- Verifica que el usuario está logueado antes de usar servicios
- Revisa `console.log(this.auth.currentUser)` en el navegador

### Los datos no se sincronizan
- Comprueba las reglas de seguridad en Firebase Console
- Abre F12 → Console para ver errores de Firebase
- Verifica que el usuario tiene permisos

### Los datos se cargan pero no se actualizan
- Asegúrate de usar `async pipe` en templates
- O suscríbete al observable en el componente
- Evita suscripciones múltiples (usar `shareReplay()` si es necesario)

## 📋 Checklist

- [ ] Reglas de seguridad configuradas en Firebase Console
- [ ] Realtime Database habilitada
- [ ] Usuarios pueden iniciar sesión
- [ ] Entrenamientos se crean exitosamente
- [ ] Entrenamientos se actualizan en tiempo real
- [ ] Rutinas se guardan por día
- [ ] Historial se registra correctamente
- [ ] App funciona en modo offline
- [ ] Datos persisten después de recargar

## 📚 Documentación Útil

- [Firebase Docs](https://firebase.google.com/docs)
- [Angular Fire Docs](https://github.com/angular/angularfire)
- [Firebase RTDB Docs](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

## 🎉 ¡Listo!

Una vez completados los pasos anteriores, tu app estará:

✅ Sincronizando datos en tiempo real con Firebase
✅ Guardando todos los datos en la nube (gratuito)
✅ Permitiendo que usuarios accedan desde cualquier dispositivo
✅ Con datos seguros según las reglas de autenticación
✅ Listo para escalar cuando sea necesario

¡Felicidades! 🚀
