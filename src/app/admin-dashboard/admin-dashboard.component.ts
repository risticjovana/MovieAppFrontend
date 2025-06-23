import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  requests: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.authService.getAllRoleRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  verifyRequest(id: number) {
    this.authService.verifyRoleRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }

  declineRequest(id: number) {
    this.authService.declineRoleRequest(id).subscribe(() => {
      this.loadRequests();
    });
  }
}
