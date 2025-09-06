import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { UserActivity } from '../model/user-activity';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent { 
  user: any;
  activity: UserActivity | null = null;
  maxLevel = 10;     
  maxHours = 500;    

  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit() {
    this.loadUserFromToken(); 
  }

  loadUserFromToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = jwtDecode<any>(token);
        console.log('Decoded user:', this.user);

        if (this.user && this.user.id) {
          this.loadUserActivity(this.user.id);
        }
      } catch {
        this.user = null;
      }
    }
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
