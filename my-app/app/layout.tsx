import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core — Feature-based Next.js starter",
  description: "A scalable Next.js project foundation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
