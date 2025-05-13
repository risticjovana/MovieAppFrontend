export interface MovieDTO {
  contentId: number;
  name: string;
  description: string;
  rating: number;
  contentTypeString: string;
  year: number;
  isFavorite: boolean;
  watched: boolean;
  duration: number;
  directorId: number;
  imageUrl: string;
}