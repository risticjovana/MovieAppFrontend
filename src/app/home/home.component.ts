import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { MovieService } from '../services/movie.service';
import { ContentService } from '../services/content.service';
import { VisualContent } from '../model/visual-content';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showSidebar: boolean = true;
  token: string | null = null;
  user: any = null;
  selectedGenre: string = 'Trending';
  moviesByGenre: VisualContent[] = [];
  posterMap: { [contentId: number]: string } = {};


  movies: string[] = [
    'Ballerina', 
    'Spider-Man: Across the Spider-Verse', 
    'Blade Runner 2049'];

  genres: string[] = [
  'Trending',
  'Action',
  'Adventure',
  'Sci-Fi',
  'Fantasy',
  'Comedy',
  'Drama',
  'Thriller',
  'Animation',
  'Romance',
  'Horror',
  'Mystery',
  'Historical',
  'Crime'
];

  backdropUrls: { [movieName: string]: string } = {};


  constructor(private movieService: MovieService, private contentService: ContentService) {}

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

    this.selectGenre(this.selectedGenre);
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
    console.log(`Selected genre: ${genre}`);

    this.contentService.getMoviesByGenre(genre).subscribe({
      next: (contents) => {
        this.moviesByGenre = contents;
        console.log(this.moviesByGenre);

        // Fetch posters for each movie
        for (const movie of this.moviesByGenre) {
          this.movieService.getPoster(movie.name).subscribe({
            next: (posterUrl) => {
              this.posterMap[movie.contentId] = posterUrl;
            },
            error: () => {
              this.posterMap[movie.contentId] = 'assets/default-movie.jpg';
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching movies by genre', err);
      }
    });
  }



  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.classList.toggle('close');
  }
}
