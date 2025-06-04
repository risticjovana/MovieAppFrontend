import { ProjectionDTO } from './projection';

export interface CinemaWithProjectionsDTO {
  cinemaId: number;
  cinemaName: string;
  type: string;
  projections: ProjectionDTO[];
}
