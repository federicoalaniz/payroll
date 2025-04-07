"use client";

import type React from "react";
import Navbar from "@/components/navigationbar";

export default function PerfilLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 pt-16">
            {children}
        </main>
        </div>
    );
}