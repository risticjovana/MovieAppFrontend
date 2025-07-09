import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.css'
})
export class MovieInfoComponent {
  contentId!: number;
  movie: any;
  backdropUrl: string = 'assets/default-backdrop.jpg';
  cast: any[] = [];

  constructor(private route: ActivatedRoute, private movieService: MovieService){}

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('contentId');
        if (id) {
          this.contentId = +id;
        }
      });
      this.loadMovieInfo(this.contentId);
    }

    loadMovieInfo(id: number) {
    this.movieService.getMovieById(this.contentId).subscribe({
      next: (movies) => {
        this.movie = movies;
        if (!this.movie) {
          console.warn('Movie not found with ID:', id);
          return;
        }

        // Fetch backdrop based on movie title (TMDb)
        this.movieService.getBackdrop(this.movie.name).subscribe({
          next: (backdrop) => this.backdropUrl = backdrop,
          error: () => {
            console.warn('Failed to load backdrop, using default.');
            this.backdropUrl = 'assets/default-backdrop.jpg';
          }
        });
        this.movieService.getMovieCastByName(this.movie.name).subscribe({
          next: (castData) => this.cast = castData.slice(0, 11),
          error: (err) => console.error('Failed to fetch cast:', err)
        });
      },
      error: (err) => {
        console.error('Failed to load movies', err);
      }
    });
  }
}
