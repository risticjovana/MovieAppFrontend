import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { MovieDTO } from '../model/movie';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { Ticket } from '../model/ticket';
import { ProjectionDTO } from '../model/projection';
import { Cinema } from '../model/cinema';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
    private baseUrl = 'http://localhost:5193/api/ticketReservation'

  constructor(private http: HttpClient) {}

  getAvailableMovies(): Observable<MovieDTO[]> {
    return this.http.get<MovieDTO[]>(`${this.baseUrl}/availableMovies`);
  }

  getProjectionsByContentId(contentId: number): Observable<CinemaWithProjectionsDTO[]> {
    return this.http.get<CinemaWithProjectionsDTO[]>(`${this.baseUrl}/projectionsByContent/${contentId}`);
  }

  reserveTicket(ticket: Ticket): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/reserve`, ticket, {
      responseType: 'text' as 'json'
    });
  }

  getMovieById(contentId: number): Observable<MovieDTO> {
    return this.http.get<MovieDTO>(`${this.baseUrl}/getmoviebyid/${contentId}`);
  }

  getCinemaById(cinemaId: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${this.baseUrl}/getcinemabyid/${cinemaId}`);
  }

  getProjectionById(projectionId: number): Observable<ProjectionDTO> {
    return this.http.get<ProjectionDTO>(`${this.baseUrl}/getprojectionbyid/${projectionId}`);
  }

  getPoster(title: string): Observable<string> {
    const apiKey = 'd3328071';
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=movie&apikey=${apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.Poster && response.Poster !== 'N/A') {
          return response.Poster;
        }
        return 'assets/default-movie.jpg';
      })
    );
  }
  getBackdrop(title: string): Observable<string> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';
    const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;

    return this.http.get<any>(searchUrl).pipe(
      map(response => {
        const movie = response.results?.[0];
        if (movie?.backdrop_path) {
          return `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
        }
        return 'assets/default-backdrop.jpg'; // fallback image
      }),
      catchError(() => of('assets/default-backdrop.jpg')) // fallback on error
    );
  }

}
