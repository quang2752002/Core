import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import type { AuthUser } from "@/features/auth/types";

const cookieName = "core_access_token";
const backend = axios.create({
  baseURL: (process.env.API_BASE_URL || "http://localhost:5082/api").replace(/\/$/, ""),
  timeout: 15_000,
  maxRedirects: 0,
  validateStatus: () => true,
});
const noCache = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ path: string[] }> };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noCache });
}

async function handle(request: NextRequest, context: Context) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  const method = request.method;
  const allowed =
    (endpoint === "auth/login" && method === "POST") ||
    (endpoint === "auth/logout" && method === "POST") ||
    (endpoint === "auth/me" && method === "GET") ||
    (endpoint === "categories" && ["GET", "POST"].includes(method)) ||
    (/^categories\/[1-9]\d{0,9}$/.test(endpoint) && ["GET", "PUT", "DELETE"].includes(method));
  if (!allowed) return json({ message: "Endpoint không tồn tại." }, 404);

  if (method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin)
      return json({ message: "Origin không hợp lệ." }, 403);
  }

  if (endpoint === "auth/logout") {
    const response = new NextResponse(null, { status: 204, headers: noCache });
    response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
    return response;
  }

  const token = request.cookies.get(cookieName)?.value;
  if (endpoint !== "auth/login" && !token) return json({ message: "Vui lòng đăng nhập." }, 401);

  let body: unknown;
  if (["POST", "PUT"].includes(method)) {
    try { body = await request.json(); }
    catch { return json({ message: "Nội dung JSON không hợp lệ." }, 400); }
  }

  try {
    const result = await backend.request({
      url: endpoint,
      method,
      params: method === "GET" ? Object.fromEntries(request.nextUrl.searchParams) : undefined,
      data: body,
      headers: token && endpoint !== "auth/login" ? { Authorization: `Bearer ${token}` } : undefined,
      signal: request.signal,
    });

    if (result.status >= 300 && result.status < 400 || result.status >= 500)
      return json({ message: "Không thể kết nối API. Vui lòng thử lại sau." }, 502);

    if (endpoint === "auth/login" && result.status === 200) {
      const { accessToken, expiresAtUtc, userName, roles, permissions } = result.data;
      const expires = new Date(expiresAtUtc);
      if (typeof accessToken !== "string" || !Number.isFinite(expires.getTime()) || expires.getTime() <= Date.now())
        return json({ message: "Phản hồi đăng nhập không hợp lệ." }, 502);
      const response = json({ userName, roles, permissions } satisfies AuthUser);
      response.cookies.set(cookieName, accessToken, {
        httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires,
      });
      return response;
    }

    const response = result.status === 204
      ? new NextResponse(null, { status: 204, headers: noCache })
      : json(result.data, result.status);
    if (result.status === 401 && endpoint !== "auth/login") response.cookies.delete(cookieName);
    if (result.status === 201 && typeof result.data?.id === "number")
      response.headers.set("Location", `/api/categories/${result.data.id}`);
    return response;
  } catch {
    return json({ message: "Không thể kết nối API. Vui lòng thử lại sau." }, 502);
  }
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
