import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
