import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  showSidebar = true;
  showTopbar = true;
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.showSidebar = currentUrl !== '/login' && currentUrl !== '/register';
        this.showTopbar = currentUrl !== '/login' && currentUrl !== '/register';
        this.isAuthPage = currentUrl.includes('/login') || currentUrl.includes('/register');
      }
    });
  }
}
