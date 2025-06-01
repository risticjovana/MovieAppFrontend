import { Component, OnInit } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Seat } from '../model/seat';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-movie-projections',
  templateUrl: './movie-projections.component.html',
  styleUrl: './movie-projections.component.css'
})
export class MovieProjectionsComponent implements OnInit {
  contentId!: number;
  cinemasWithProjections: CinemaWithProjectionsDTO[] = [];
  isLoading = true;
  errorMsg = '';
  selectedCinemaId: number | null = null;
  selectedProjectionId: number | null = null;
  filteredProjections: any[] = [];
  selectedProjection: any = null;
  seatArray: number[] = [];
  startDate: Date = this.getStartOfWeek(new Date());
  daysInWeek: Date[] = [];
  selectedDate: Date | null = null;
  selectedCinema: any;
  token: string | null = null;
  user: any = null;
  rows: { left: (Seat | null)[], right: (Seat | null)[] }[] = [];  
  selectedSeats: Set<number> = new Set();
  bookedSeats: Set<number> = new Set();
  seatMap: Seat[] = [];
  showTicketPopup = false;
  reservedSeats: string[] = [];
  movieInfo: any;
  posterUrl: string = 'assets/default-movie.jpg';
  backdropUrl: string = 'assets/default-backdrop.jpg';

  constructor(private route: ActivatedRoute, private movieService: MovieService, private router: Router) {
    this.generateWeek(this.startDate);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contentId');
      if (id) {
        this.contentId = +id;
        this.loadProjections(this.contentId);
        this.loadMovieInfo(this.contentId);
      }
    });
    const today = new Date();
    this.selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    this.generateSeats(50);
      if (this.isBrowser()) {
      this.token = localStorage.getItem('token');
      if (this.token) {
        try {
          this.user = jwtDecode(this.token);  // Decode the token
          console.log(this.user);  // The user data from the token
        } catch (error) {
          console.error('Invalid token', error);
        }
      }
    }
  }

  loadProjections(contentId: number) {
    this.isLoading = true;
    this.movieService.getProjectionsByContentId(contentId).subscribe({
      next: (data) => {
        this.cinemasWithProjections = data;

        if (this.cinemasWithProjections.length > 0) {
          this.selectedCinemaId = this.cinemasWithProjections[0].cinemaId;
          this.onCinemaChange();

          if (this.filteredProjections.length > 0) {
            this.selectedProjectionId = this.filteredProjections[0].id;
            this.onProjectionChange();
          }
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load projections.';
        this.isLoading = false;
      }
    });
  }

  generateSeats(count: number) {
    this.rows = [];
    if (count === 0) return;

    const seatsPerRow = 12;
    const halfSeatsPerRow = seatsPerRow / 2;
    const totalRows = Math.ceil(count / seatsPerRow);

    // Ensure seatMap is ready
    if (this.seatMap.length !== count) {
      this.generateSeatMap(count);
    }

    let seatIndex = 0;
    for (let i = 0; i < totalRows; i++) {
      const rowLeft: (Seat | null)[] = [];
      const rowRight: (Seat | null)[] = [];

      for (let j = 0; j < halfSeatsPerRow; j++) {
        rowLeft.push(seatIndex < count ? this.seatMap[seatIndex++] : null);
      }

      for (let j = 0; j < halfSeatsPerRow; j++) {
        rowRight.push(seatIndex < count ? this.seatMap[seatIndex++] : null);
      }

      this.rows.push({ left: rowLeft, right: rowRight });
    }
  }

  getGridColumn(index: number): string {
    const seatsPerRow = 10;
    const aisleAfter = 5;
    const colInRow = index % seatsPerRow;
    return colInRow < aisleAfter ? (colInRow + 1).toString() : (colInRow + 2).toString();
  }

  onCinemaChange() {
    const selectedCinema = this.cinemasWithProjections.find(c => c.cinemaId === this.selectedCinemaId);
    this.filteredProjections = selectedCinema ? selectedCinema.projections : [];
    this.selectedCinema = this.cinemasWithProjections.find(c => c.cinemaId === this.selectedCinemaId);

    if (this.filteredProjections.length > 0) {
      this.selectedProjectionId = this.filteredProjections[0].id;
      this.onProjectionChange();
    } else {
      this.selectedProjectionId = null;
      this.selectedProjection = null;
      this.generateSeats(50);
    }
  }

  onProjectionChange() {
    this.selectedProjection = this.filteredProjections.find(p => p.id === this.selectedProjectionId);
    const available = this.selectedProjection?.seatNumber ?? 50;
    this.generateSeatMap(available);
    this.generateSeats(available);
  }

  getColumnCount(seatCount: number): number {
    return Math.ceil(Math.sqrt(seatCount));
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  generateWeek(start: Date) {
    this.daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      this.daysInWeek.push(d);
    }
  }

  previousWeek() {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.generateWeek(this.startDate);
  }

  nextWeek() {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.generateWeek(this.startDate);
  }

  selectDate(day: Date) {
    this.selectedDate = day;
  }

  getLocalStorage(): Storage | null {
    return typeof window !== 'undefined' ? window.localStorage : null;
  }

  toggleSeatSelection(seatNumber: number | null) {
    if (seatNumber === null || this.bookedSeats.has(seatNumber)) return; // Can't select booked seats

    if (this.selectedSeats.has(seatNumber)) {
      this.selectedSeats.delete(seatNumber);
    } else {
      this.selectedSeats.add(seatNumber);
    }

    console.log('Selected (unconfirmed) seats:', Array.from(this.selectedSeats));
  }

  getReservedSeatCount(): number {
      return this.selectedSeats.size;
  }

  submitReservation() {
    if (!this.isBrowser()) return;

    const reservedSeats = Array.from(this.selectedSeats);
    const key = this.getStorageKey();

    // Load existing data from localStorage
    const rawData = localStorage.getItem(key);
    let allReservations: Record<number, number[]> = {};

    if (rawData) {
      try {
        allReservations = JSON.parse(rawData);
      } catch (err) {
        console.error('Failed to parse reservation data:', err);
      }
    }

    // Merge new reservations for this user
    const userId = this.user?.id;
    const existingSeats = allReservations[userId] || [];
    const updatedSeats = Array.from(new Set([...existingSeats, ...reservedSeats]));

    allReservations[userId] = updatedSeats;

    // Save back to localStorage
    localStorage.setItem(key, JSON.stringify(allReservations));

    // Continue with reservation backend call
    if (this.selectedProjectionId == null) {
      alert('Projection ID nije definisan!');
      return;
    }

    const reservationData = {
      projectionId: this.selectedProjectionId,
      contentId: this.contentId,
      userId: userId,
      seatNumber: reservedSeats.length,
      roomNumber: this.selectedProjection.roomNumber,
      purchaseTime: new Date().toISOString()
    };

    console.log('Sending reservation data:', reservationData);

    this.movieService.reserveTicket(reservationData).subscribe({
      next: () => {
        console.log(`Reservation successful for ${reservedSeats.length} seats.`);
        this.openPopup(reservedSeats.map(String));
        this.selectedSeats.clear();
        this.generateSeatMap(this.seatMap.length);  // Regenerate the map
      },
      error: (err) => {
        console.error('Reservation failed:', err);
      }
    });
  }

  generateSeatMap(count: number) {
    this.seatMap = [];

    let allReserved: Record<number, number[]> = {};

    if (this.isBrowser()) {
      const key = this.getStorageKey();
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          allReserved = JSON.parse(raw);
        } catch (err) {
          console.error('Failed to parse seat map data:', err);
        }
      }
    }

    // Flatten all reserved seats from all users
    const booked = new Set<number>();
    for (const seatList of Object.values(allReserved)) {
      seatList.forEach(seat => booked.add(seat));
    }

    for (let i = 1; i <= count; i++) {
      const isBooked = booked.has(i);
      this.seatMap.push(new Seat(i, isBooked));
    }
  }

  getStorageKey(): string {
    return `reservedSeats_movie${this.contentId}_cinema${this.selectedCinemaId}_proj${this.selectedProjectionId}`;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  openPopup(seats: string[]) {
    this.reservedSeats = seats;
    this.showTicketPopup = true;
  }

  closePopup() {
    this.router.navigate(['/my-reservations']);
    this.showTicketPopup = false;
  }

  loadMovieInfo(id: number) {
    this.movieService.getAvailableMovies().subscribe({
      next: (movies) => {
        this.movieInfo = movies.find(m => m.contentId === id);
        if (!this.movieInfo) {
          console.warn('Movie not found with ID:', id);
          return;
        }

        // Fetch poster based on movie title (OMDb)
        this.movieService.getPoster(this.movieInfo.name).subscribe({
          next: (poster) => this.posterUrl = poster,
          error: () => {
            console.warn('Failed to load poster, using default.');
            this.posterUrl = 'assets/default-movie.jpg';
          }
        });

        // Fetch backdrop based on movie title (TMDb)
        this.movieService.getBackdrop(this.movieInfo.name).subscribe({
          next: (backdrop) => this.backdropUrl = backdrop,
          error: () => {
            console.warn('Failed to load backdrop, using default.');
            this.backdropUrl = 'assets/default-backdrop.jpg';
          }
        });
      },
      error: (err) => {
        console.error('Failed to load movies', err);
      }
    });
  }

}
