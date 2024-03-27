import { api } from "./index";

export function getGroups() {
  return api.get("/groups").then((res) => res.data);
}
