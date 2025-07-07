import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showSidebar: boolean = true;
  token: string | null = null;
  user: any = null;

  movies: string[] = ['Ballerina', 'Spider-Man: Across the Spider-Verse', 'Blade Runner 2049'];
  backdropUrls: { [movieName: string]: string } = {};


  constructor(private movieService: MovieService) {}

  ngAfterViewInit(): void {
    new Swiper('.movie-slider', {
      slidesPerView: 'auto',
      spaceBetween: 40,
      centeredSlides: true,
      grabCursor: true,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
  }

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
    
    // Load backdrops for each movie
    this.movies.forEach(movieName => {
      this.movieService.getBackdrop(movieName).subscribe({
        next: (backdropUrl) => {
          this.backdropUrls[movieName] = backdropUrl;
        },
        error: () => {
          console.warn(`Failed to load backdrop for ${movieName}, using default.`);
          this.backdropUrls[movieName] = 'assets/default-backdrop.jpg';
        }
      });
    });
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.classList.toggle('close');
  }
}
