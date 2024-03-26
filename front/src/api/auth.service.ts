import { api } from "./index";
import { newAccountRequest } from "src/interfaces/IAuth";

export function loginAccount(email: string, password: string) {
  return api.post("/sessions", { email, password }).then((res) => res.data);
}

export function registerAccount(newAccount: newAccountRequest) {
  return api.post("/users", newAccount).then((res) => res.data);
}
