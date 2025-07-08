import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-series-info',
  templateUrl: './series-info.component.html',
  styleUrl: './series-info.component.css'
})
export class SeriesInfoComponent {
contentId!: number;
  series: any;
  backdropUrl: string = 'assets/default-backdrop.jpg';

  constructor(private route: ActivatedRoute, private movieService: MovieService){}

    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('contentId');
        if (id) {
          this.contentId = +id;
        }
      });
      this.loadSeriesInfo(this.contentId);
    }

    loadSeriesInfo(id: number) {
    this.movieService.getSeriesById(this.contentId).subscribe({
      next: (movies) => {
        this.series = movies;
        console.log(this.series)
        if (!this.series) {
          console.warn('Series not found with ID:', id);
          return;
        }

        // Fetch backdrop based on movie title (TMDb)
        this.movieService.getSeriesBackdrop(this.series.name).subscribe({
          next: (backdrop) => this.backdropUrl = backdrop,
          error: () => {
            console.warn('Failed to load backdrop, using default.');
            this.backdropUrl = 'assets/default-backdrop.jpg';
          }
        });
      },
      error: (err) => {
        console.error('Failed to load series', err);
      }
    });
  }
}
