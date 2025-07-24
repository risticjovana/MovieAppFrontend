import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  followers: any[] = [];
  user: any;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.user = jwtDecode(token);
          if (this.user && this.user.id) {
            this.loadFollowers(this.user.id);
          } else {
            console.error('Decoded token does not contain an id.');
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.warn('No token found in localStorage.');
      }
    }
  }

  loadFollowers(userId: number): void {
    this.authService.getFollowers(userId).subscribe({
      next: (data) => {
        this.followers = data;
      },
      error: (err) => {
        console.error('Error loading followers:', err);
      }
    });
  }
}
