import { api } from "./index";

import { ProfileRequest } from "src/interfaces/IProfile";

export function updateProfile(profile: ProfileRequest) {
  return api.put(`/users`, profile).then((res) => res.data);
}

export function updateUserImage(imageData: any) {
  return api
    .patch(`/users/avatar`, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
}
