import { http } from "@/lib/http";
import type { AuthUser, LoginDto } from "./types";

export const authService = {
  async login(dto: LoginDto) {
    return (await http.post<AuthUser>("/auth/login", dto)).data;
  },
  async me(signal?: AbortSignal) {
    return (await http.get<AuthUser>("/auth/me", { signal })).data;
  },
  async logout() {
    await http.post("/auth/logout");
  },
};
