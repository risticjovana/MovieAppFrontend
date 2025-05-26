import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { MovieDTO } from '../model/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.css'] // fix: should be styleUrls
})
export class TicketReservationComponent implements OnInit {
  movies: MovieDTO[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getAvailableMovies().subscribe({
      next: (data) => this.movies = data,
      error: (err) => console.error('Error loading movies:', err)
    });
  }

  goToProjections(contentId: number) {
    this.router.navigate(['/movies', contentId, 'projections']);
  }
}
