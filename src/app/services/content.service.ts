import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { VisualContent } from '../model/visual-content';
import { Review } from '../model/review';
import { Critique } from '../model/critique';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private baseUrl = 'http://localhost:5193/api/content';

  constructor(private http: HttpClient) {}

  // Call backend to get movies by genre name
  getMoviesByGenre(genreName: string): Observable<VisualContent[]> {
    return this.http.get<VisualContent[]>(`${this.baseUrl}/by-genre/${encodeURIComponent(genreName)}`);
  }

  getSeriesByGenre(genreName: string): Observable<VisualContent[]> {
    return this.http.get<VisualContent[]>(`${this.baseUrl}/series-by-genre/${encodeURIComponent(genreName)}`);
  }

  addReview(contentId: number, review: Omit<Review, 'contentId' | 'date' | 'reviewId'>): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/${contentId}/add-review`, review);
  }

  getReviewsByContentId(contentId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${contentId}/content-reviews`);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}/delete-review`);
  }

  addCritique(critique: Omit<Critique, 'critiqueId' | 'date'>): Observable<Critique> {
    return this.http.post<Critique>(`${this.baseUrl}/add-critique`, critique);
  }

  getCritiquesByContentId(contentId: number): Observable<Critique[]> {
    return this.http.get<Critique[]>(`${this.baseUrl}/${contentId}/content-critiques`);
  }
}
