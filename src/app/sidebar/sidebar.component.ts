import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private authService: AuthService, private router: Router){
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
