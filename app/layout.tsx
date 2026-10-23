import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Girl in a Bookstore",
  description: "Stories about books, travel, cuisine, fashion, and everyday beauty.",
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
