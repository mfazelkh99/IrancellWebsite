import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "مرکز ارتباط با ایرانسل - کد ۶۵۰۱۶",
  description: "خدمات اینترنت، خرید سیم‌کارت و مودم ایرانسل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Header />
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}