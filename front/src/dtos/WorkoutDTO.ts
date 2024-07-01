import { ExerciseDTO } from "./ExerciseDTO";

export type WorkoutDTO = {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
  times_completed: number;
  last_completed_at: string | null;
  average_execution_time: number;
  exercises: ExerciseDTO[];
};
