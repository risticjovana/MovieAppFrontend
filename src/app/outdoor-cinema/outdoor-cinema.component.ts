import { Component, Input } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';

@Component({
  selector: 'app-outdoor-cinema',
  templateUrl: './outdoor-cinema.component.html',
  styleUrl: './outdoor-cinema.component.css'
})
export class OutdoorCinemaComponent {
  @Input() cinema!: CinemaWithProjectionsDTO | undefined
  rows = Array(3).fill(0);  // 4 parking rows
  spots = Array(7).fill(0); // 6 spots per row
  selectedSpot: { row: number, spot: number } | null = null;
  price: number = 12.99; // or dynamic

  selectSpot(row: number, spot: number) {
    this.selectedSpot = { row, spot };
  }

  reserveSpot() {
    if (this.selectedSpot) {
      const seatNumber = 100 + this.selectedSpot.row * this.spots.length + this.selectedSpot.spot + 1;
      console.log(`Reserving seat ${seatNumber}`); 
    }
  }
}
