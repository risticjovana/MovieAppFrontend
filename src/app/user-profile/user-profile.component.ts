import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MovieService } from '../services/movie.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserActivity } from '../model/user-activity';

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
  availableRoles: string[] = ['MODERATOR', 'ADMINISTRATOR', 'CRITIC', 'EDITOR'];  
  selectedRole: string = '';
  activity: UserActivity | null = null;
  maxLevel = 10;     
  maxHours = 500; 

  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}


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

        if (this.user && this.user.id) {
          this.loadUserActivity(this.user.id);
        }
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

  requestRoleChange() {
    if (!this.selectedRole || !this.user) return;

    this.authService.requestRoleChange({
      userId: this.user.id,
      requestedRole: this.selectedRole.toLowerCase()
    }).subscribe({
      next: (res) => {
        this.selectedRole = '';
      },
      error: (err) => {
        alert('Failed to send role request: ' + err.error);
      }
    });
  }

  loadUserActivity(userId: number) {
    this.authService.getUserActivity(userId).subscribe({
      next: (activity) => {
        this.activity = activity;
        console.log('User activity:', activity);
      },
      error: (err) => {
        console.error('Error fetching user activity', err);
      }
    });
  }
}
