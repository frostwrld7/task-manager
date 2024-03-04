import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
  description: "Task manager web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="fr">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}