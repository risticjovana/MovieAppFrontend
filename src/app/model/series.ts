export interface SeriesDTO {
  contentId: number;
  name: string;
  description: string;
  rating: number;
  contentTypeString: string;
  year: number;
  isFavorite: boolean;
  watched: boolean;
  numberOfEpisodes: number;
  directorId: number;
  numberOfSeasons: number;
}