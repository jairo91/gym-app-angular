import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gym-app';
  isLoggedIn = false;
  isAdmin = false;
  private authSubscription: Subscription = new Subscription();
  private adminSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.adminSubscription = this.adminService.isCurrentUserAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

  async logout() {
    const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmLogout) {
      try {
        await this.authService.logout();
        await this.router.navigate(['']);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  }
}

