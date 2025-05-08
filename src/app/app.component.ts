import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showSidebar: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to the route changes and update sidebar visibility
    this.router.events.subscribe(() => {
      // Check if the current route is 'login' or 'register' and hide the sidebar
      const currentRoute = this.router.url;
      this.showSidebar = currentRoute !== '/login' && currentRoute !== '/register';
    });
  }
}
