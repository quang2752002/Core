"use client";

import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "./auth-service";
import type { AuthUser, LoginDto } from "./types";
import { errorMessage } from "@/lib/http";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string;
  expired: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    authService.me(controller.signal).then(setUser).catch((failure) => {
      if (axios.isCancel(failure)) return;
      if (axios.isAxiosError(failure) && failure.response?.status === 401) setUser(null);
      else setError(errorMessage(failure));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setExpired(true);
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const result = await authService.login(dto);
    setUser(result);
    setError("");
    setExpired(false);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setExpired(false);
  }, []);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    setRevision((value) => value + 1);
  }, []);

  return <AuthContext.Provider value={{ user, loading, error, expired, login, logout, retry }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
