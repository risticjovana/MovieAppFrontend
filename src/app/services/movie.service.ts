import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDTO } from '../model/movie';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { Ticket } from '../model/ticket';


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

  reserveTicket(ticket: Ticket): Observable<any> {
    return this.http.post(`${this.baseUrl}/reserve`, ticket);
  }
}
