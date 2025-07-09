import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { MovieDTO } from '../model/movie';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { Ticket } from '../model/ticket';
import { ProjectionDTO } from '../model/projection';
import { Cinema } from '../model/cinema';
import { SeriesDTO } from '../model/series';


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

  getSeriesById(contentId: number): Observable<SeriesDTO> {
    return this.http.get<SeriesDTO>(`${this.baseUrl}/getseriesbyid/${contentId}`);
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

  getSeriesPoster(title: string): Observable<string> {
    const apiKey = 'd3328071';
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=series&apikey=${apiKey}`;

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

  getSeriesBackdrop(title: string): Observable<string> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';
    const searchUrl = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(title)}`;

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

  getSeriesCastByName(seriesName: string): Observable<any[]> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';

    // Step 1: Search series by name
    const searchUrl = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(seriesName)}`;

    return this.http.get<any>(searchUrl).pipe(
      switchMap(response => {
        const series = response.results?.[0];
        if (!series) return of([]); // not found

        const seriesId = series.id;
        const creditsUrl = `${baseUrl}/tv/${seriesId}/credits?api_key=${apiKey}&language=en-US`;

        // Step 2: Use the series ID to get cast
        return this.http.get<any>(creditsUrl).pipe(
          map(credits => credits.cast || []),
          catchError(() => of([]))
        );
      }),
      catchError(() => of([]))
    );
  }

  getMovieCastByName(movieName: string): Observable<any[]> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';

    // Step 1: Search series by name
    const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

    return this.http.get<any>(searchUrl).pipe(
      switchMap(response => {
        const movie = response.results?.[0];
        if (!movie) return of([]); // not found

        const movieId = movie.id;
        const creditsUrl = `${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;

        // Step 2: Use the movie ID to get cast
        return this.http.get<any>(creditsUrl).pipe(
          map(credits => credits.cast || []),
          catchError(() => of([]))
        );
      }),
      catchError(() => of([]))
    );
  }

  getSeasonsBySeriesName(seriesName: string): Observable<any[]> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';
    const searchUrl = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(seriesName)}`;

    return this.http.get<any>(searchUrl).pipe(
      switchMap(response => {
        const series = response.results?.[0];
        if (!series) return of([]);

        const seriesId = series.id;
        const detailsUrl = `${baseUrl}/tv/${seriesId}?api_key=${apiKey}&language=en-US`;

        return this.http.get<any>(detailsUrl).pipe(
          map(details => details.seasons || []),
          catchError(() => of([]))
        );
      }),
      catchError(() => of([]))
    );
  }

  getEpisodesBySeriesNameAndSeason(seriesName: string, seasonNumber: number): Observable<any[]> {
    const apiKey = '162c3a034e5d753ea69686ec9c50494b';
    const baseUrl = 'https://api.themoviedb.org/3';
    const searchUrl = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(seriesName)}`;

    return this.http.get<any>(searchUrl).pipe(
      switchMap(response => {
        const series = response.results?.[0];
        if (!series) return of([]);

        const seriesId = series.id;
        const seasonUrl = `${baseUrl}/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`;

        return this.http.get<any>(seasonUrl).pipe(
          map(seasonData => seasonData.episodes || []),
          catchError(() => of([]))
        );
      }),
      catchError(() => of([]))
    );
  }

}
