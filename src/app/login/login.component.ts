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
  loginForm!: FormGroup;

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
          console.error('Token missing in response.');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  onSignUp(): void {
    this.router.navigate(['/register']);
  }

}
