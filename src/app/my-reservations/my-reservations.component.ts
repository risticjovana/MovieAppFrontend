import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MovieDTO } from '../model/movie';
import { Cinema } from '../model/cinema';
import { ProjectionDTO } from '../model/projection';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
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

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadUserFromToken();
    this.loadReservationsFromLocalStorage();
  }

  loadUserFromToken() {
    if (typeof localStorage === 'undefined') {
      this.user = null;
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = jwtDecode(token);
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
            const reservation = {
              movieId,
              cinemaId,
              projectionId,
              seats
            };

            this.userReservations.push(reservation);

            // Log the loaded reservation to console:
            console.log('Loaded reservation:', reservation);
          }
        } catch {
          continue;
        }
      }
    }

    this.fetchReservationDetails();
    console.log('All loaded reservations:', this.userReservations);
  }

  fetchReservationDetails() {
    this.userReservations.forEach(res => {
      // Movie
      if (!this.movies.some(m => m.contentId === res.movieId)) {
        this.movieService.getMovieById(res.movieId).subscribe(movie => {
          if (movie) this.movies.push(movie);
          console.log('Loaded movie:', movie);
        });
      }

      // Cinema
      if (!this.cinemas.some(c => c.cinemaId === res.cinemaId)) {
        this.movieService.getCinemaById(res.cinemaId).subscribe(cinema => {
          if (cinema) this.cinemas.push(cinema);
          console.log('Loaded cinema:', cinema);
        });
      }

      // Projection
      if (!this.projections.some(p => p.id === res.projectionId)) {
        this.movieService.getProjectionById(res.projectionId).subscribe(projection => {
          if (projection) this.projections.push(projection);
          console.log('Loaded projection:', projection);
        });
      }
    });
  }
  getMovieName(movieId: number): string {
    const movie = this.movies.find(m => m.contentId === movieId);
    return movie?.name || 'Loading...';
  }

  getCinemaName(cinemaId: number): string {
    const cinema = this.cinemas.find(c => c.cinemaId === cinemaId);
    return cinema?.name || 'Loading...';
  }

  getProjectionTime(projectionId: number): string {
    const projection = this.projections.find(p => p.id === projectionId);
    return projection?.time || 'Loading...';
  }
}
