import { api } from "./index";

export function getWorkouts() {
  return api.get(`/workouts`).then((res) => res.data);
}
