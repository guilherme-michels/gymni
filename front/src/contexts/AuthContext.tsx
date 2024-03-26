import { ReactNode, createContext, useEffect, useState } from "react";
import { UserDTO } from "../dtos/UserDTO";
import { loginAccount } from "src/api/auth.service";
import {
  saveUserStorage,
  getUserStorage,
  removeUserStorage,
} from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingLoggedUserData: boolean;
  signOut: () => Promise<void>;
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

  async function signIn(email: string, password: string) {
    try {
      const response = await loginAccount(email, password);

      if (response) {
        setUser(response.user);
        saveUserStorage(response.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingLoggedUserData(true);
      setUser({} as UserDTO);
      await removeUserStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingLoggedUserData(false);
    }
  }

  async function loadUserData() {
    try {
      const loggedUser = await getUserStorage();

      if (loggedUser) {
        setUser(loggedUser);
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

  return (
    <AuthContext.Provider
      value={{ user, signIn, isLoadingLoggedUserData, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
