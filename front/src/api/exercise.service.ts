import { api } from "./index";

export function getExerciseByGroup(group: string) {
  return api.get(`/exercises/bygroup/${group}`).then((res) => res.data);
}

export function getExerciseById(exerciseId: string) {
  return api.get(`/exercises/${exerciseId}`).then((res) => res.data);
}

export function addExerciseRegister(exerciseId: string) {
  return api
    .post("/history", { exercise_id: exerciseId })
    .then((res) => res.data);
}
