import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  showConfirmation = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.authService.getUserById(userId).subscribe(u => this.user = u);
  }

  blockUser() {
    this.authService.blockUser(this.user.id).subscribe(() => {
      this.user.status = 'Blocked';
      this.showConfirmation = true;
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
