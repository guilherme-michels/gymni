import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "src/api";

import { UserDTO } from "../dtos/UserDTO";
import { loginAccount } from "src/api/auth.service";

import {
  saveUserStorage,
  getUserStorage,
  removeUserStorage,
} from "@storage/storageUser";

import {
  saveAuthTokenStorage,
  getAuthTokenStorage,
  removeAuthTokenStorage,
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingLoggedUserData: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingLoggedUserData, setIsLoadingLoggedUserData] = useState(true);

  async function updateUserAndToken(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  async function saveUserAndTokenStorage(
    userData: UserDTO,
    token: string,
    refresh_token: string
  ) {
    try {
      setIsLoadingLoggedUserData(true);
      await saveUserStorage(userData);
      await saveAuthTokenStorage({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await loginAccount(email, password);

      if (response.user && response.token && response.refresh_token) {
        await saveUserAndTokenStorage(
          response.user,
          response.token,
          response.refresh_token
        );

        updateUserAndToken(response.user, response.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingLoggedUserData(true);

      setUser({} as UserDTO);
      await removeUserStorage();
      await removeAuthTokenStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await saveUserStorage(userUpdated);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingLoggedUserData(true);

      const loggedUser = await getUserStorage();
      const { token } = await getAuthTokenStorage();

      if (loggedUser && token) {
        updateUserAndToken(loggedUser, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        isLoadingLoggedUserData,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
