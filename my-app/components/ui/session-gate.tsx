"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { Brand } from "./icon";

export function SessionGate({ children }: { children: ReactNode }) {
  const { user, loading, error, retry } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user && !error) router.replace("/login"); }, [loading, user, error, router]);
  if (loading || !user) return <main className="session-screen"><Brand />{error ? <><p role="alert">{error}</p><button className="button primary" onClick={retry}>Thử kết nối lại</button></> : <p role="status">Đang tải không gian làm việc…</p>}</main>;
  return children;
}
