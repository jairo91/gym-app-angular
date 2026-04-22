import { Routes } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { ImcComponent } from './Components/imc/imc.component';
import { HistorialComponent } from './Components/historial/historial.component';
import { RutinaComponent } from './Components/rutina/rutina.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
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
    path: 'imc',
    component: ImcComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    component: RegisterComponent, // O crea un componente de perfil
    canActivate: [AuthGuard]
  }
];
