export interface WorkoutRequest {
  description: string;
  average_execution_time: number;
  exercises: {
    id: string;
  }[];
}
