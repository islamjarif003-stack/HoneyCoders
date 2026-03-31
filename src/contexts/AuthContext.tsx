import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getToken, setToken, removeToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
}

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  roles: string[];
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  isVendor: boolean;
  isAdmin: boolean;
  token: string | null;
  session: { access_token: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, profile: null, roles: [],
  signOut: async () => {}, signIn: async () => {}, signUp: async () => {},
  isVendor: false, isAdmin: false, token: null, session: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const data = await api("/auth/me");
      setUser({ id: data.id, email: data.email });
      setProfile({ display_name: data.display_name, avatar_url: data.avatar_url });
      setRoles(data.roles || []);
    } catch {
      removeToken();
      setUser(null);
      setProfile(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(data.token);
    setUser({ id: data.user.id, email: data.user.email });
    setProfile({ display_name: data.user.display_name, avatar_url: data.user.avatar_url });
    setRoles(data.user.roles || []);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    await api("/auth/register", {
      method: "POST",
      body: { email, password, display_name: displayName },
    });
  };

  const signOut = async () => {
    removeToken();
    setUser(null);
    setProfile(null);
    setRoles([]);
  };

  const token = getToken();

  return (
    <AuthContext.Provider
      value={{
        user, loading, profile, roles, signOut, signIn, signUp,
        isVendor: roles.includes("vendor"),
        isAdmin: roles.includes("admin"),
        token: token || null,
        session: token ? { access_token: token } : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
