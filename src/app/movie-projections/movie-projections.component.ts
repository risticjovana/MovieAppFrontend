import { Component } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { FormsModule } from '@angular/forms';
import { Seat } from '../model/seat';

@Component({
  selector: 'app-movie-projections',
  templateUrl: './movie-projections.component.html',
  styleUrl: './movie-projections.component.css'
})
export class MovieProjectionsComponent {
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

  constructor(private route: ActivatedRoute, private movieService: MovieService,) {
    this.generateWeek(this.startDate);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contentId');
      if (id) {
        this.contentId = +id;
        this.loadProjections(this.contentId);
      }
    });
    const today = new Date();
    this.selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    this.generateSeats(50);
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

  rows: { left: (Seat | null)[], right: (Seat | null)[] }[] = [];


  generateSeats(count: number) {
  this.rows = [];
  if (count === 0) return;

  const seatsPerRow = 10;
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
    this.generateSeats(available);
    this.generateSeatMap(available);
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

  selectedSeats: Set<number> = new Set();

  toggleSeatSelection(seatNumber: number | null) {
    if (seatNumber === null) return;

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
  const reservedCount = this.getReservedSeatCount();
  const reservedSeats = Array.from(this.selectedSeats);
  const key = this.getStorageKey();

  // Save to localStorage only now (confirmed)
  localStorage.setItem(key, JSON.stringify(reservedSeats));

  // Optionally: Mark seats as booked in seatMap
  for (let seat of this.seatMap) {
    if (this.selectedSeats.has(seat.number)) {
      seat.booked = true;
    }
  }

  // Clear current selection
  this.selectedSeats.clear();

  console.log(`Reservation submitted for ${reservedCount} seats.`);
}


  seatMap: Seat[] = [];

  generateSeatMap(count: number) {
    this.seatMap = [];
    this.selectedSeats.clear(); // Reset to re-sync from storage

    const storage = this.getLocalStorage();
    const key = this.getStorageKey();
    const savedSeatNumbers: number[] = storage ? JSON.parse(storage.getItem(key) || '[]') : [];

    for (let i = 1; i <= count; i++) {
      const isBooked = savedSeatNumbers.includes(i);
      this.seatMap.push(new Seat(i, isBooked));
      if (isBooked) {
        this.selectedSeats.add(i);
      }
    }
  }

  getStorageKey(): string {
    return `reservedSeats_cinema${this.selectedCinemaId}_proj${this.selectedProjectionId}`;
  }

  
}
