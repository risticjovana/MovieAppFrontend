import { Component } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-projections',
  templateUrl: './movie-projections.component.html',
  styleUrl: './movie-projections.component.css'
})
export class MovieProjectionsComponent {
  contentId!: number;
    cinemasWithProjections: CinemaWithProjectionsDTO[] = [];
    isLoading = true;
    errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contentId');
      if (id) {
        this.contentId = +id;
        this.loadProjections(this.contentId);
      }
    });
  }

  loadProjections(contentId: number) {
    this.isLoading = true;
    this.movieService.getProjectionsByContentId(contentId).subscribe({
      next: (data) => {
        this.cinemasWithProjections = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load projections.';
        this.isLoading = false;
      }
    });
  }

//cinema seats logic
showPopup = false;
selectedProjection: any = null;
seatArray: number[] = [];

openSeatsPopup(projection: any) {
  this.selectedProjection = projection;
  const totalSeats = 50; // Set a default total number of seats (or fetch from DB)
  this.seatArray = Array.from({ length: totalSeats }, (_, i) => i + 1);
  this.showPopup = true;
}

closePopup() {
  this.showPopup = false;
  this.selectedProjection = null;
  this.seatArray = [];
}
}
