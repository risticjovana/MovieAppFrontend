import { Seat } from "./seat";

export interface ProjectionDTO {
  id: number;
  date: string; // or Date if you convert it
  time: string; // usually comes as a string like "18:30:00"
  availableTickets: number;
  roomNumber: number;
  seatNumber: number;
  seats?: Seat[];
}
