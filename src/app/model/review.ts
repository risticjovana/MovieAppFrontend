export interface Review {
  reviewId?: number;
  date?: string;
  description: string;   
  rating: number;
  contentId?: number;  
  userId: number;
}
