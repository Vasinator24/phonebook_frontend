import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import sdk from "../sdk";
import type { LoginData, User } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sdk.auth
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(data: LoginData) {
    const loggedUser = await sdk.auth.login(data);
    setUser(loggedUser);
  }

  async function logout() {
    await sdk.auth.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
