import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  userRole: string = '';

  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object){
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.userRole = decodedToken.role?.toLowerCase() || '';
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
    }
  }

  isAdmin(): boolean {
    return this.userRole === 'administrator';
  }

  isGuest(): boolean {
    return this.userRole === 'obican_korisnik';
  }

  isEditor(): boolean {
    return this.userRole === 'urednik_sadrzaja';
  }
  
}
