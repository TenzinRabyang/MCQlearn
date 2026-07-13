import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Nursing MCQ Study Quiz",
  description: "A focused, distraction-free environment for nursing students to study multiple-choice questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <main className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}