import { api } from "./index";
import { WorkoutRequest } from "src/interfaces/IWorkout";

export function getWorkouts() {
  return api.get(`/workouts`).then((res) => res.data);
}

export function addWorkout(workout: WorkoutRequest) {
  return api.post(`/workouts`, workout).then((res) => res.data);
}

export function deleteWorkout(id: string) {
  return api.delete(`/workouts/${id}`).then((res) => res.data);
}

export function updatedWorkout(id: string, workout: WorkoutRequest) {
  return api.put(`/workouts/${id}`, workout).then((res) => res.data);
}

export function getWorkoutById(workoutId: string) {
  return api.get(`/workouts/${workoutId}`).then((res) => res.data);
}

export function addWorkoutRegister(workoutId: string) {
  return api.put(`/workouts/history/${workoutId}`).then((res) => res.data);
}
