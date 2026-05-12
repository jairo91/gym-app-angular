import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.adminService.isCurrentUserAdmin().pipe(
      map(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
