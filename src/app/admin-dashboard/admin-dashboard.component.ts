import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserInfo } from 'os';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  requests: any[] = [];
  users: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadRequests();
    this.loadUsers();
  }

  loadRequests() {
    this.authService.getAllRoleRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe((data) => {
      this.users = data;
      console.log(this.users)
    });
  }

  verifyRequest(id: number) {
    this.authService.verifyRoleRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  blockUser(id: number) {
    this.authService.blockUser(id).subscribe({
      next: (res) => {
        console.log(res.message);
        this.loadUsers();  
      },
      error: (err) => console.error('Failed to block user:', err)
    });
  }


  declineRequest(id: number) {
    this.authService.declineRoleRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  goToUserProfile(userId: number) {
    this.router.navigate(['/user-details', userId]);  
  }
}
