import { createContext } from "react";
import type { LoginData, User } from "../types";

export type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
