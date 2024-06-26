export interface WorkoutRequest {
  description: string;
  exercises: {
    id: string;
  }[];
}
