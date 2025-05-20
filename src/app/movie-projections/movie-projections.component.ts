import { Component } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { FormsModule } from '@angular/forms';

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
    this.generateSeats(50);
  }

  loadProjections(contentId: number) {
    this.isLoading = true;
    this.movieService.getProjectionsByContentId(contentId).subscribe({
      next: (data) => {
        this.cinemasWithProjections = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load projections.';
        this.isLoading = false;
      }
    });
  }
  
  rows: { left: (number | null)[], right: (number | null)[] }[] = [];

generateSeats(count: number) {
  this.rows = [];
  if (count === 0) return;

  const seatsPerRow = 10;          // Total seats per row (even number)
  const halfSeatsPerRow = seatsPerRow / 2;  // Seats on each side of aisle

  // Number of rows needed to fit all seats
  const totalRows = Math.ceil(count / seatsPerRow);

  let seatNumber = 1;

  for (let i = 0; i < totalRows; i++) {
    const rowLeft: (number | null)[] = [];
    const rowRight: (number | null)[] = [];

    // Fill left side seats
    for (let j = 0; j < halfSeatsPerRow; j++) {
      if (seatNumber <= count) {
        rowLeft.push(seatNumber++);
      } else {
        rowLeft.push(null); // empty seat spot
      }
    }

    // Fill right side seats
    for (let j = 0; j < halfSeatsPerRow; j++) {
      if (seatNumber <= count) {
        rowRight.push(seatNumber++);
      } else {
        rowRight.push(null);
      }
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
    this.selectedProjectionId = null;
    this.selectedProjection = null;
    this.generateSeats(50); // Reset to 50 when changing cinema
  }

  onProjectionChange() {
    this.selectedProjection = this.filteredProjections.find(p => p.id === this.selectedProjectionId);
    const available = this.selectedProjection?.availableTickets ?? 50;
    this.generateSeats(available);
  }
  getColumnCount(seatCount: number): number {
    // Try to make it square-like
    return Math.ceil(Math.sqrt(seatCount));
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // Sunday = 0, Monday = 1 ...
    const diff = day === 0 ? -6 : 1 - day; // assuming week starts Monday
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0,0,0,0);
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

}
