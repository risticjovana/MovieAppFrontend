import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CinemaWithProjectionsDTO } from '../model/cinema-with-projections';

@Component({
  selector: 'app-outdoor-cinema',
  templateUrl: './outdoor-cinema.component.html',
  styleUrl: './outdoor-cinema.component.css'
})
export class OutdoorCinemaComponent {
  @Input() cinema!: CinemaWithProjectionsDTO | undefined
  @Output() reserve = new EventEmitter<number>(); // Emit seat number

  rows = Array(3).fill(0);  // 4 parking rows
  spots = Array(7).fill(0); // 6 spots per row
  selectedSpot: { row: number, spot: number } | null = null;
  price: number = 12.99; // or dynamic

  selectSpot(row: number, spot: number) {
    this.selectedSpot = { row, spot };
  }

  reserveSpot() {
    if (this.selectedSpot) {
      this.reserve.emit(1);
    }
  }
}
