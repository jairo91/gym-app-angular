# 🔧 Guía Paso a Paso - Implementar Firebase

## Paso 1: Configurar Firebase Console (5 minutos)

### 1.1 Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona el proyecto **gym-app-a1964**
3. En el menú izquierdo, busca **Realtime Database**

### 1.2 Habilitar Realtime Database (si no está habilitada)
1. Haz clic en **Crear base de datos**
2. Selecciona **Iniciar en modo de prueba**
3. Región: Selecciona la más cercana a ti (ej: `europe-west1`)
4. Haz clic en **Habilitar**

Espera a que se cree (1-2 minutos)

### 1.3 Configurar Reglas de Seguridad
1. Una vez creada, ve a la pestaña **Rules**
2. Verás las reglas por defecto (Permitir todo - NO SEGURO)
3. Reemplaza TODO el contenido con esto:

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

4. Haz clic en **Publicar** (botón azul superior derecho)
5. ¡Listo! Reglas configuradas ✅

---

## Paso 2: Probar Firebase en la App (10 minutos)

### 2.1 Iniciar la aplicación
```bash
ng serve
# O si usas npm
npm start
```

La app estará en `http://localhost:4200`

### 2.2 Iniciar sesión
1. Haz clic en **Login**
2. Usa Google Sign-In (ya configurado)
3. Inicia sesión con tu cuenta

### 2.3 Probar Entrenamientos (Primero!)
1. Ve a **Gestión de Entrenamientos**
2. Haz clic en **➕ Crear Entrenamiento**
3. Completa:
   - Nombre: "Mi Primer Entrenamiento"
   - Descripción: "Prueba Firebase"
4. Haz clic en **Seleccionar Ejercicios**
5. Selecciona 2-3 ejercicios
6. Haz clic en **Guardar**

### 2.4 Verificar en Firebase Console
1. Vuelve a Firebase Console
2. Ve a **Realtime Database**
3. Expande `usuarios` → tu UID → `entrenamientos`
4. ¡Verás tu entrenamiento! ✅

Si lo ves aquí, Firebase funciona correctamente.

### 2.5 Probar sincronización en tiempo real
1. Abre Firebase Console en una pestaña
2. En otra pestaña, edita el entrenamiento
3. Deberías ver los cambios reflejados en Firebase en segundos ✅

---

## Paso 3: Actualizar Componentes (OPCIONAL - 15 min c/u)

Los componentes que falta migrar pueden usar el mismo patrón que `entrenamientos.component.ts`.

### 3.1 Actualizar `rutina.component.ts`

**Cambio 1: Imports y constructor**
```typescript
// Agregar import
import { FirebaseRutinaService } from '../../services/firebase-rutina.service';

// En el componente
export class RutinaComponent implements OnInit {
  rutinas$ = this.rutinaService.getRutinas$();
  
  constructor(private rutinaService: FirebaseRutinaService) {}
  
  ngOnInit() {
    // Los datos se sincronizan automáticamente
  }
  
  // Cambiar guardarRutina() para usar Firebase
  guardarRutina() {
    const fecha = this.selectedDate.toISOString().split('T')[0];
    
    this.rutinaService.guardarRutinaDia(fecha, {
      entrenamientoId: this.selectedWorkout.id,
      series: this.currentWorkoutExercises.flatMap(ex => 
        ex.series.map(s => ({
          ejercicioId: ex.id,
          nombreEjercicio: ex.nombre,
          numero: s.numero,
          peso: s.peso,
          repeticiones: s.repeticiones,
          completada: s.completada
        }))
      ),
      notas: this.rutinaNotas
    }).then(() => {
      alert('Rutina guardada en Firebase!');
    }).catch(error => {
      console.error('Error:', error);
    });
  }
}
```

**Cambio 2: Template**
```html
<!-- Cambiar de: *ngFor="let rutina of rutinas" -->
<!-- A: -->
<div *ngFor="let rutina of rutinas$ | async">
  <!-- contenido -->
</div>
```

### 3.2 Actualizar `historial.component.ts`

```typescript
import { FirebaseHistorialService } from '../../services/firebase-historial.service';

export class HistorialComponent implements OnInit {
  historial$ = this.historialService.getHistorial$();
  
  constructor(private historialService: FirebaseHistorialService) {}
  
  ngOnInit() {
    // Sincronización automática
  }
  
  verHistorial(exercise: Exercise) {
    // Obtener historial del ejercicio
    this.historialService.getHistorialEjercicio$(exercise.id).subscribe(registros => {
      this.selectedExerciseHistory = registros;
    });
  }
}
```

### 3.3 Actualizar `home.component.ts`

```typescript
import { FirebaseHistorialService } from '../../services/firebase-historial.service';

export class HomeComponent implements OnInit {
  stats$ = this.historialService.getEstadisticasEjercicio$(1); // por ejemplo
  
  constructor(private historialService: FirebaseHistorialService) {}
  
  ngOnInit() {
    // Stats se actualizan en tiempo real
  }
}
```

---

## Paso 4: Migración de Datos (OPCIONAL)

Si tienes datos en localStorage y quieres copiarlos a Firebase:

### 4.1 En la consola del navegador (F12)
```javascript
// Obtener datos de localStorage
const entrenamientos = JSON.parse(localStorage.getItem('entrenamientos') || '[]');

// Copiar a Firebase
const user = firebase.auth().currentUser;
if (user) {
  entrenamientos.forEach(ent => {
    firebase.database()
      .ref(`usuarios/${user.uid}/entrenamientos/${ent.id}`)
      .set(ent)
      .then(() => console.log('Migrado:', ent.nombre));
  });
}
```

### 4.2 Luego, eliminar localStorage (opcional)
```javascript
localStorage.removeItem('entrenamientos');
```

---

## Paso 5: Debugging (Solucionar Problemas)

### Problema: "No hay datos en Firebase"

**Solución:**
1. Verifica que estás logueado: `console.log(this.auth.currentUser)`
2. Verifica que UID es correcto
3. Abre la consola del navegador (F12) para ver errores
4. Revisa las reglas en Firebase

### Problema: "Error de permisos"

**Solución:**
```
PERMISSION_DENIED: Permission denied
```

Significa que las reglas no permiten la operación:
1. Abre Firebase Console
2. Ve a **Realtime Database** → **Rules**
3. Verifica que las reglas están correctas
4. Haz clic en **Publicar**
5. Intenta de nuevo

### Problema: "Los datos no se actualizan en tiempo real"

**Solución:**
1. Asegúrate de usar `async pipe` en templates
2. O suscríbete correctamente al observable
3. Abre Firebase Console en otra pestaña para ver los cambios

### Problema: "Usuario no autenticado"

**Solución:**
```typescript
// En el componente
constructor(private auth: Auth) {
  this.auth.onAuthStateChanged(user => {
    console.log('User:', user);
  });
}
```

---

## Paso 6: Configurar Datos Iniciales

### 6.1 Crear ejercicios por defecto
1. En Firebase Console, ve a **Realtime Database**
2. Haz clic en el "+" junto a `ejercicios-disponibles`
3. O corre este script en la consola después de iniciar sesión:

```javascript
const exercises = [
  { id: 1, nombre: 'Press de Banca', pesoMaximo: 100, unidad: 'kg', imagen: 'https://...' },
  { id: 2, nombre: 'Sentadilla', pesoMaximo: 150, unidad: 'kg', imagen: 'https://...' },
  // ... más ejercicios
];

const db = firebase.database();
exercises.forEach(ex => {
  db.ref(`ejercicios-disponibles/${ex.id}`).set(ex);
});
```

---

## Paso 7: Producción (Cuando esté listo)

### 7.1 Cambiar a Reglas de Producción
Las reglas actuales son seguras pero si quieres más restringidas:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    },
    "ejercicios-disponibles": {
      ".read": true,
      ".write": false
    }
  }
}
```

### 7.2 Hacer build para producción
```bash
ng build --configuration production
```

### 7.3 Desplegar
Puedes desplegar a Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Checklist de Implementación

### Configuración Inicial
- [ ] Realtime Database habilitada en Firebase Console
- [ ] Reglas de seguridad configuradas
- [ ] Usuario puede iniciar sesión

### Componente Entrenamientos
- [x] Implementado (¡ya hecho!)
- [x] CRUD funcionando
- [x] Sincronización en tiempo real

### Testing Local
- [ ] Crear entrenamiento exitosamente
- [ ] Ver entrenamiento en Firebase Console
- [ ] Editar entrenamiento (se actualiza en tiempo real)
- [ ] Eliminar entrenamiento (desaparece de Firebase)
- [ ] Abrir en otra pestaña (ve cambios en tiempo real)

### Componentes Adicionales (Opcional)
- [ ] Rutina: Migrar a `FirebaseRutinaService`
- [ ] Historial: Migrar a `FirebaseHistorialService`
- [ ] Home: Mostrar estadísticas en tiempo real

### Producción
- [ ] Cambiar reglas a producción
- [ ] Revisar límites de Firebase
- [ ] Configurar backups
- [ ] Deploy a Firebase Hosting

---

## Estructura de Carpetas

```
src/app/
├── services/
│   ├── firebase-entrenamiento.service.ts    ✅
│   ├── firebase-exercise.service.ts         ✅
│   ├── firebase-rutina.service.ts           ✅
│   ├── firebase-historial.service.ts        ✅
│   ├── auth.service.ts                      (existente)
│   └── entrenamiento.service.ts             (fallback local)
│
├── Components/
│   ├── entrenamientos/
│   │   ├── entrenamientos.component.ts      ✅ (actualizado)
│   │   ├── entrenamientos.component.html    ✅ (actualizado)
│   │   └── entrenamientos.component.css
│   │
│   ├── rutina/
│   │   ├── rutina.component.ts              (pendiente)
│   │   ├── rutina.component.html
│   │   └── rutina.component.css
│   │
│   └── historial/
│       ├── historial.component.ts           (pendiente)
│       ├── historial.component.html
│       └── historial.component.css
│
└── models/
    ├── entrenamiento/
    │   └── entrenamiento.model.ts           ✅
    └── exercise/
        ├── exercise.model.ts                ✅
        └── exercise-history.model.ts        ✅
```

---

## Comandos Útiles

```bash
# Iniciar dev server
ng serve

# Build para producción
ng build --configuration production

# Ejecutar tests
ng test

# Lint
ng lint

# Ver tamaño del bundle
ng build --stats-json
webpack-bundle-analyzer dist/gym-app/stats.json
```

---

## Límites Firebase Gratuito

| Límite | Valor |
|--------|-------|
| Almacenamiento | 1 GB |
| Descargas | 100 GB/mes |
| Conexiones simultáneas | 100 |
| Escrituras | Ilimitadas (razonable) |
| Lecturas | Ilimitadas (razonable) |

*Es más que suficiente para desarrollo y pequeños usuarios*

---

## Recursos Adicionales

- [Firebase Docs](https://firebase.google.com/docs)
- [Angular Fire](https://github.com/angular/angularfire)
- [RTDB Docs](https://firebase.google.com/docs/database)
- [Security Rules](https://firebase.google.com/docs/database/security)

---

## 🎯 Resumen Rápido

1. **Firebase Console**: Configurar reglas (5 min)
2. **Iniciar app**: `ng serve`
3. **Probar**: Crear entrenamiento
4. **Verificar**: Ver en Firebase Console
5. **Actualizar otros componentes**: (opcional, 15 min c/u)

**¡Eso es todo!** 🚀

---

## Preguntas Frecuentes

**¿Necesito firebase-tools instalado?**
No para desarrollo. Solo si quieres hacer deploy a Firebase Hosting.

**¿Puedo usar localStorage y Firebase juntos?**
Sí, pero es confuso. Elige uno o el otro.

**¿Qué pasa si pierdo conexión?**
Firebase guarda en caché. Los datos se sincronizan cuando vuelve la conexión.

**¿Puedo compartir entrenamientos entre usuarios?**
Sí, necesitarías agregar una colección `entrenamientos-compartidos`.

**¿Es seguro con estas reglas?**
Sí, cada usuario solo ve sus datos. Los ejercicios son públicos (lectura).

---

¡Listo! Sigue estos pasos y tendrás Firebase funcionando. 💪
