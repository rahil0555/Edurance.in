import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edurance - Education Platform",
  description: "Dynamic education platform with AI-generated lessons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

