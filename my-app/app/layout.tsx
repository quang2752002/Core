import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core Workspace · Quản lý danh mục",
  description: "Không gian quản lý danh mục với quyền truy cập theo vai trò.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
