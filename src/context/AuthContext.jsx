"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/authService";
import { getMe } from "@/services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null); 
  const [isReady, setIsReady] = useState(false);

  const loadMe = async () => {
    try {
      const res = await getMe();
      setMe(res.data);
      return res.data;
    } catch {
      setMe(null);
      return null;
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    (async () => {
      if (t) await loadMe();
      setIsReady(true);
    })();
  }, []);

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    const receivedToken = res.data?.token;
    if (!receivedToken) throw new Error("Token not found in login response");

    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);

    const current = await loadMe();

    if (current?.role === "ADMIN") router.push("/admin");
    else router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        me,
        role: me?.role || null,
        isAdmin: me?.role === "ADMIN",
        isAuthenticated: !!token,
        isReady,
        login,
        logout,
        refreshMe: loadMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}