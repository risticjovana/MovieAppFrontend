import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { ContentService } from '../services/content.service';
import { Review } from '../model/review';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CollectionService } from '../services/collection.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Critique } from '../model/critique';
import { AuthService } from '../services/auth.service';

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
  showCritiquePopup = false;
  reviewRating = 0;
  hoverRating = 0;
  reviewText = '';
  reviews: any[] = [];
  critiques: any[] = [];
  stars = Array(10);
  user: any;
  collections: any[] = [];
  selectedCollectionId: number | null = null;
  isDropdownOpen = false;
  isSeasonDropdownOpen = false;
  popupMessage: string | null = null;

  private swiperInstance?: Swiper;

  constructor(
    private route: ActivatedRoute, 
    private movieService: MovieService, 
    private contentService: ContentService,
    private collectionService: CollectionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contentId');
      if (id) {
        this.contentId = +id;
        this.loadSeriesInfo(this.contentId);
        this.loadUserFromToken();
        this.loadReviews(this.contentId);
        this.loadCritiques(this.contentId);
      }
    });
  }

  ngOnDestroy() {
    this.destroySwiper();
  }

  loadCritiques(contentId: number) {
    if (!contentId || contentId <= 0) {
      console.warn('Invalid content id for critiques.');
      this.critiques = [];
      return;
    }

    this.contentService.getCritiquesByContentId(contentId).subscribe({
      next: (critiques) => {
        if (!critiques) {
          this.critiques = [];
          return;
        }

        this.critiques = critiques;
        this.critiques.forEach((critique: any) => {
          this.authService.getUserById(critique.criticId).subscribe({
            next: (user) => {
              critique.userFullName = `${user.firstName} ${user.lastName}`;
            },
            error: () => {
              critique.userFullName = 'Unknown Critic';
            }
          });
        });
      },
      error: () => {
        this.critiques = [];
      }
    });
  }


  loadSeriesInfo(id: number) {
    if (!id || id <= 0) {
      console.warn('Invalid series id provided.');
      return;
    }

    this.movieService.getSeriesById(id).subscribe({
      next: (seriesData) => {
        if (!seriesData) {
          console.warn('No series data returned.');
          return;
        }

        this.series = seriesData;
        const name = this.series?.name;
        if (!name) return;

        this.loadBackdrop(name);
        this.loadCast(name);
        this.loadSeasons(name);
      },
      error: () => { 
        this.series = null;
      }
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

  loadUserFromToken() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.user = jwtDecode(token);
          this.loadUserCollections(this.user.id);
          console.log('Decoded user:', this.user);
        } catch {
          this.user = null;
      }
    }
  }

  loadReviews(contentId: number) {
    this.contentService.getReviewsByContentId(contentId).subscribe({
      next: (reviews) => {
        if (!reviews) {
          this.reviews = [];
          return;
        }
 
        this.reviews = reviews;
        this.reviews.forEach((review: any) => {
          this.authService.getUserById(review.userId).subscribe({
            next: (user) => {
              review.userFullName = `${user.firstName} ${user.lastName}`;
              review.userEmail = `${user.email}`;
            },
            error: () => {
              review.userFullName = 'Unknown User';
            }
          });
        });
      },
      error: () => {
        this.reviews = [];
      }
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
      console.error('Please select a star rating before submitting!');
      return;
    }
    if (!this.reviewText.trim()) {
      console.error('Please write a review before submitting!');
      return;
    }

    const review: Omit<Review, 'contentId' | 'date' | 'reviewId'> = {
      description: this.reviewText,
      rating: this.reviewRating,
      userId: this.user.id
    };

    this.contentService.addReview(this.contentId, review).subscribe({
      next: (createdReview) => {
        console.log('Review submitted:', createdReview); 
 
        this.loadReviews(this.contentId);

        this.showReviewPopup = false;
        this.reviewRating = 0;
        this.reviewText = '';
      },
      error: (err) => {
        console.error('Failed to submit review:', err); 
      }
    });
  }

 submitCritique() {
    if (this.reviewRating === 0 || !this.reviewText.trim()) return;

    const critique: Omit<Critique, 'critiqueId' | 'date'> = {
      description: this.reviewText,
      rating: this.reviewRating,
      contentId: this.contentId,  
      criticId: this.user.id       
    };

    this.contentService.addCritique(critique).subscribe({
      next: (created) => {
        console.log('Critique submitted:', created);
        this.showCritiquePopup = false;
        this.reviewText = '';
        this.reviewRating = 0;
        
      this.loadCritiques(this.contentId);
      },
      error: (err) => console.error('Failed to submit critique:', err)
    });
  }

  loadUserCollections(userId: number) {
    this.collectionService.getUserCollections(userId).subscribe({
      next: (collections) => {
        this.collections = collections;
      },
      error: (err) => {
        console.error('Failed to load user collections:', err);
      }
    });
  }

  addSeriesToCollection() {
    if (!this.selectedCollectionId) {
      console.error('Please select a collection.');
      return;
    }
  }
  
  onCollectionChange() {
    if (!this.selectedCollectionId) return;

    const selectedCollection = this.collections.find(c => c.id === this.selectedCollectionId);

    this.collectionService
      .addContentToCollection(this.contentId, this.selectedCollectionId, this.user.id)
      .subscribe({
        next: (response) => { 
          if (response) {
            this.popupMessage = `Added to "${selectedCollection?.name}"`;
          } else {
            this.popupMessage = 'Failed to add content.';
          }

          setTimeout(() => this.popupMessage = null, 2000);
        },
        error: (err) => {
          console.error('Failed to add series to collection:', err);
          this.popupMessage = `Added to "${selectedCollection?.name}"`;
          setTimeout(() => this.popupMessage = null, 2000); 
        }
      });
  } 

  deleteReview(reviewId: number) {
    this.contentService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.reviewId !== reviewId);
        this.snackBar.open('Review deleted', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Failed to delete review:', err);
        this.snackBar.open('Failed to delete review', 'Close', { duration: 2000 });
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCollection(id: number | null) {
    this.selectedCollectionId = id;
    this.isDropdownOpen = false;
    this.onCollectionChange();  
  }

  getSelectedCollectionName(): string | null {
    if (this.selectedCollectionId === null) return null;
    if (this.selectedCollectionId === 0) return '+ New Collection';
    const col = this.collections.find(c => c.id === this.selectedCollectionId);
    return col ? col.name : null;
  }

  toggleSeasonDropdown() {
    this.isSeasonDropdownOpen = !this.isSeasonDropdownOpen;
  }
 
  selectSeason(seasonNumber: number) {
    this.selectedSeason = seasonNumber;
    this.isSeasonDropdownOpen = false;
    this.onSeasonChange(seasonNumber);
  }
 
  getSelectedSeasonName(): string | null {
    if (!this.selectedSeason) return null;
    const season = this.seasons.find(s => s.season_number === this.selectedSeason);
    return season ? `Season ${season.season_number}` : null;
  }
}
