import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

@Component({
  selector: 'app-series-info',
  templateUrl: './series-info.component.html',
  styleUrl: './series-info.component.css'
})
export class SeriesInfoComponent implements OnDestroy {
  contentId!: number;
  series: any;
  backdropUrl: string = 'assets/default-backdrop.jpg';
  cast: any[] = [];
  seasons: any[] = [];
  episodes: any[] = [];
  selectedSeason!: number;
  showReviewPopup = false;
  reviewRating = 0;
  hoverRating = 0;
  reviewText = '';
  stars = Array(10);

  private swiperInstance?: Swiper;

  constructor(private route: ActivatedRoute, private movieService: MovieService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contentId');
      if (id) {
        this.contentId = +id;
        this.loadSeriesInfo(this.contentId);
      }
    });
  }

  ngOnDestroy() {
    this.destroySwiper();
  }

  loadSeriesInfo(id: number) {
    this.movieService.getSeriesById(id).subscribe({
      next: (seriesData) => {
        this.series = seriesData;

        const name = this.series?.name;
        if (!name) {
          console.warn('Series name is missing.');
          return;
        }

        this.loadBackdrop(name);
        this.loadCast(name);
        this.loadSeasons(name);
      },
      error: (err) => console.error('Failed to load series info:', err)
    });
  }

  loadBackdrop(name: string) {
    this.movieService.getSeriesBackdrop(name).subscribe({
      next: (backdrop) => this.backdropUrl = backdrop,
      error: () => this.backdropUrl = 'assets/default-backdrop.jpg'
    });
  }

  loadCast(name: string) {
    this.movieService.getSeriesCastByName(name).subscribe({
      next: (castData) => this.cast = castData.slice(0, 11),
      error: (err) => console.error('Failed to fetch cast:', err)
    });
  }

  loadSeasons(name: string) {
    this.movieService.getSeasonsBySeriesName(name).subscribe({
      next: (seasons) => {
        this.seasons = seasons;
        if (seasons.length > 0) {
          this.selectedSeason = seasons[0].season_number;
          this.loadEpisodes(name, this.selectedSeason);
        }
      },
      error: (err) => console.error('Failed to fetch seasons:', err)
    });
  }

  loadEpisodes(name: string, seasonNumber: number) {
    this.movieService.getEpisodesBySeriesNameAndSeason(name, seasonNumber).subscribe({
      next: (episodes) => {
        this.episodes = episodes;
        this.initSwiper();
      },
      error: (err) => console.error('Failed to fetch episodes:', err)
    });
  }

  onSeasonChange(seasonNumber: number) {
    this.selectedSeason = seasonNumber;
    if (this.series?.name) {
      this.loadEpisodes(this.series.name, this.selectedSeason);
    }
  }

  private initSwiper() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // Skip initialization in non-browser environment
      return;
    }

    this.destroySwiper();

    setTimeout(() => {
      this.swiperInstance = new Swiper('.episode-slider', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        freeMode: true,
      });
    }, 0);
  }

  private destroySwiper() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = undefined;
    }
  }

  setRating(rating: number) {
    this.reviewRating = rating;
  }

  submitReview() {
    if (this.reviewRating === 0) {
      alert('Please select a star rating before submitting!');
      return;
    }
    // Your submit logic here (e.g., Firestore call)
    console.log('Rating:', this.reviewRating);
    console.log('Review:', this.reviewText);
    
    // After submission, close popup and reset
    this.showReviewPopup = false;
    this.reviewRating = 0;
    this.reviewText = '';
  }
}
