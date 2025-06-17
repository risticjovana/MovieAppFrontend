import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MovieService } from '../services/movie.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  user: any;
  showModal = false;
  passwordModel = {
    currentPassword: '',
    newPassword: ''
  };

  constructor(private movieService: MovieService, private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}


  ngOnInit() {
    this.loadUserFromToken(); 
  }

  loadUserFromToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = jwtDecode(token);
        console.log('Decoded user:', this.user);
      } catch {
        this.user = null;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  openChangePassword() {
    this.showModal = true;
  }

  closeChangePassword() {
    this.showModal = false;
    this.passwordModel = { currentPassword: '', newPassword: '' };
  }
  
  changePassword() {
    if (!this.user) return;

    this.authService.changePassword({
      userId: this.user.id,
      currentPassword: this.passwordModel.currentPassword,
      newPassword: this.passwordModel.newPassword
    }).subscribe({
      next: (res) => {
        alert(res); // "Password changed successfully."
        this.closeChangePassword();
      },
      error: (err) => {
        alert(err.error); // Show server-side error
      }
    });
  }

}
