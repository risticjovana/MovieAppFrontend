import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';

@Component({
  selector: 'app-outdoor-cinema',
  templateUrl: './outdoor-cinema.component.html',
  styleUrls: ['./outdoor-cinema.component.css'] // note typo fix here from styleUrl to styleUrls
})
export class OutdoorCinemaComponent implements OnInit {
  @Input() cinema!: CinemaWithProjectionsDTO | undefined;
  @Output() reserve = new EventEmitter<number>(); // Emit seat number

  rows = Array(3).fill(0);  // 3 rows
  spots = Array(10).fill(0); // 7 spots per row
  selectedSpot: { row: number, spot: number } | null = null;
  price: number = 12.99;

  // Change reservedSpots to a map of row -> reserved seat numbers
  reservedSpotsMap: Record<string, number[]> = {};

  ngOnInit() {
    this.loadReservedSpots();
  }

  loadReservedSpots() {
    const key = this.getStorageKey(); // your localStorage key
    console.log('Loading reserved spots from localStorage with key:', key);

    const rawData = localStorage.getItem(key);
    console.log('Raw data from localStorage:', rawData);

    if (!rawData) {
      this.reservedSpotsMap = {};
      console.log('No reservation data found in localStorage.');
      return;
    }

    try {
      // Parse localStorage JSON directly into reservedSpotsMap
      this.reservedSpotsMap = JSON.parse(rawData);
      console.log('Parsed reservations from localStorage:', this.reservedSpotsMap);
    } catch (e) {
      console.error('Error parsing localStorage reservations', e);
      this.reservedSpotsMap = {};
    }
  }

  isSpotReserved(row: number, spot: number): boolean {
    const seatNumber = 100 + row * this.spots.length + spot + 1;
    const rowKey = row.toString();

    // Check if row exists and seatNumber is included in reserved list for that row
    for (const key in this.reservedSpotsMap) {
      if (this.reservedSpotsMap[key].includes(seatNumber)) {
        return true;
      }
    }
    return false;
  }

  selectSpot(row: number, spot: number) {
    if (this.isSpotReserved(row, spot)) {
      alert('This parking spot is already reserved!');
      return;
    }
    this.selectedSpot = { row, spot };
  }

  reserveSpot() {
    if (this.selectedSpot) {
      const seatNumber = 100 + this.selectedSpot.row * this.spots.length + this.selectedSpot.spot + 1;
      this.reserve.emit(seatNumber);
    }
  }

  getStorageKey(): string {
    // Example localStorage key - adjust to your actual key
    return `reservedSeats_movie101_cinema2_proj4`;
  }
}
