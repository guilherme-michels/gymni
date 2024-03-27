import { api } from "./index";

export function getHistory() {
  return api.get(`/history`).then((res) => res.data);
}
