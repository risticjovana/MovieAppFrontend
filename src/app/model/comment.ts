export interface CommentDto {
  id: number;
  text: string;
  createdAt: string;
  moderatorName: string;
  userId?: number;
}
