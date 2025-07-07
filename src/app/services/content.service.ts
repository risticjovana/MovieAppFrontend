import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { VisualContent } from '../model/visual-content';

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
}
