import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  token: string | null = null;
  user: any = null;

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    
    if (this.token) {
      try {
        this.user = jwtDecode(this.token);  // Decode the token
        console.log(this.user);  // The user data from the token
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.classList.toggle('close');
  }
}
