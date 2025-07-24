import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-other-users',
  templateUrl: './other-users.component.html',
  styleUrls: ['./other-users.component.css']
})
export class OtherUsersComponent implements OnInit {
  users: any[] = [];
  user: any;
  selectedUser: any = null;
  showPopup = false;
  popupMessage = '';

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.user = jwtDecode(token);
          if (this.user && this.user.id) {
            this.loadUsersAndExtras(this.user.id);
          } else {
            console.error('Decoded token does not contain an id.');
          }
        } catch {
          console.error('Failed to decode token:');
        }
      } else {
        console.warn('No token found in localStorage.');
      }
    }
  }

  private loadUsersAndExtras(currentUserId: number): void {
    this.authService.getAllUsersExcept(currentUserId).subscribe({
      next: users => {
        this.users = users.map(u => ({
          ...u,
          followers: this.getRandomFollowers(),
          isFollowed: false
        }));

        this.http.get<any>(`https://randomuser.me/api/?results=${this.users.length}`).subscribe({
          next: data => {
            this.users.forEach((user, i) => {
              const apiUser = data.results[i];
              user.gender = apiUser.gender;
              user.avatarUrl = apiUser.picture.large;
            });
            console.log(this.users)
          },
          error: err => console.error('Error fetching random users:', err)
        });
      },
      error: err => console.error('Error fetching users:', err)
    });
  }


  openUserModal(user: any): void {
    this.selectedUser = user;
  }

  closeUserModal(): void {
    this.selectedUser = null;
  }

  followUser(user: any): void {
    this.authService.followUser(this.user.id, user.id).subscribe({
      next: () => {
        user.isFollowed = true;
        this.popupMessage = 'You are now following ' + user.firstName + ' ' + user.lastName + '!';
        this.showPopup = true;
      },
      error: err => {
        console.error('Error following user:', err);
        this.popupMessage = 'Failed to follow user.';
        this.showPopup = true;
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
  }

  viewFollowers(){
    
  }

  getRandomFollowers(): number {
    return Math.floor(Math.random() * 90) + 10; 
  }

}
