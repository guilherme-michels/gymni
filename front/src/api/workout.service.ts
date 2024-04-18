import { api } from "./index";

export function getWorkouts() {
  return api.get(`/workouts`).then((res) => res.data);
}

export function getWorkoutById(workoutId: string) {
  return api.get(`/workouts/${workoutId}`).then((res) => res.data);
}

export function addWorkoutRegister(workoutId: string) {
  return api.put(`/workouts/history/${workoutId}`).then((res) => res.data);
}
