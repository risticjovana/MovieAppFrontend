import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  showSidebar: boolean = false;
  loginForm!: FormGroup;
  loginError: string | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        } else {
          this.loginError = "Login failed. Please try again.";
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.loginError = "Invalid email or password."; 
        } else {
          this.loginError = "An unexpected error occurred. Please try again later.";
        }
      }
    });
  }


  onSignUp(): void {
    this.router.navigate(['/register']);
  }

}
