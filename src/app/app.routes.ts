import { Routes } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ImcComponent } from './Components/imc/imc.component';
import { HistorialComponent } from './Components/historial/historial.component';
import { RutinaComponent } from './Components/rutina/rutina.component';
import { EntrenamientosComponent } from './Components/entrenamientos/entrenamientos.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './Components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'rutina',
    component: RutinaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'entrenamientos',
    component: EntrenamientosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'imc',
    component: ImcComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard]
  }
];
