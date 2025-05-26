interface TicketInfo {
  seat: number;
  movieName: string;
  roomNumber: number;
  time: string;
}
export interface Ticket {
  ticketId?: number;  // može biti opcionalno, jer se generiše u bazi
  projectionId: number;
  contentId: number;
  userId: number;
  seatNumber: number;
  roomNumber: number;
  purchaseTime?: string; // ISO string, možeš slati ili pustiti da backend popuni
}