export class Seat {
  number: number;
  booked: boolean;

  constructor(number: number, booked: boolean = false) {
    this.number = number;
    this.booked = booked;
  }
}