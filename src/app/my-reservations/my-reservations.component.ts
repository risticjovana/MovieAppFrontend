import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MovieDTO } from '../model/movie';
import { Cinema } from '../model/cinema';
import { ProjectionDTO } from '../model/projection';
import { MovieService } from '../services/movie.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  user: any;
  userReservations: Array<{
    movieId: number,
    cinemaId: number,
    projectionId: number,
    seats: number[]
  }> = [];

  movies: MovieDTO[] = [];
  cinemas: Cinema[] = [];
  projections: ProjectionDTO[] = [];

  constructor(private movieService: MovieService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.loadUserFromToken();
    this.loadReservationsFromLocalStorage();
  }

  loadUserFromToken() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = jwtDecode(token);
        console.log('Decoded user:', this.user);
      } catch {
        this.user = null;
      }
    }
  }

  loadReservationsFromLocalStorage() {
    if (!this.user) return;

    this.userReservations = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const match = key.match(/^reservedSeats_movie(\d+)_cinema(\d+)_proj(\d+)$/);
      if (match) {
        const movieId = +match[1];
        const cinemaId = +match[2];
        const projectionId = +match[3];

        const dataStr = localStorage.getItem(key);
        if (!dataStr) continue;

        try {
          const parsedData = JSON.parse(dataStr);
          const userIdStr = this.user.id.toString();

          if (parsedData[userIdStr]) {
            const seats: number[] = parsedData[userIdStr];
            this.userReservations.push({ movieId, cinemaId, projectionId, seats });
            console.log(`Loaded reservation for movie ${movieId}, cinema ${cinemaId}, projection ${projectionId}, seats:`, seats); 
          }
        } catch {
          continue;
        }
      }
    }

    this.fetchReservationDetails();
  }

  fetchReservationDetails() {
    this.userReservations.forEach(res => {
      if (!this.movies.find(m => m.contentId === res.movieId)) {
        this.movieService.getMovieById(res.movieId).subscribe(movie => {
          if (movie) {
            this.movies.push(movie);
          }
        });
      }

      if (!this.cinemas.find(c => c.cinemaId === res.cinemaId)) {
        this.movieService.getCinemaById(res.cinemaId).subscribe(cinema => {
          if (cinema) this.cinemas.push(cinema);
        });
      }

      if (!this.projections.find(p => p.id === res.projectionId)) {
        this.movieService.getProjectionById(res.projectionId).subscribe(projection => {
          if (projection) {
            this.projections.push(projection);
          }
        });
      }
    });
  }

  getMovieName(movieId: number): string {
    return this.movies.find(m => m.contentId === movieId)?.name || 'Loading...';
  }

  getCinemaName(cinemaId: number): string {
    return this.cinemas.find(c => c.cinemaId === cinemaId)?.name || 'Loading...';
  }

  getProjectionTime(projectionId: number): string {
    return this.projections.find(p => p.id === projectionId)?.time || 'Loading...';
  }
}
