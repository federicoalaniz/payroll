"use client";

import type React from "react";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PersonasProvider } from "@/contexts/PersonasContext";
import Navbar from "@/components/navbar";
import { SonnerProvider } from "@/components/sonner-provider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const showNavbar = pathname !== "/login";

    return (
        <html lang="es">
            <body className={inter.className}>
                <AuthProvider>
                    <PersonasProvider>
                        <div className="flex flex-col min-h-screen">
                            {showNavbar && <Navbar />}
                            <main
                                className={`flex-grow ${
                                    showNavbar ? "pt-16" : ""
                                }`}
                            >
                                {children}
                            </main>
                        </div>
                        <SonnerProvider />
                    </PersonasProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
