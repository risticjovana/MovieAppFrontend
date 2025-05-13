import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDTO } from '../model/movie';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
    private baseUrl = 'http://localhost:5193/api/ticketReservation'

  constructor(private http: HttpClient) {}

  getAvailableMovies(): Observable<MovieDTO[]> {
    return this.http.get<MovieDTO[]>(`${this.baseUrl}/availableMovies`);
  }
}
