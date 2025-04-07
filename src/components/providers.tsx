"use client";

import type React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PersonasProvider } from "@/contexts/PersonasContext";
import { LiquidacionesProvider } from "@/contexts/LiquidacionesContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { SonnerProvider } from "@/components/sonner-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <UserProfileProvider>
                <PersonasProvider>
                    <LiquidacionesProvider>
                        {children}
                        <SonnerProvider />
                    </LiquidacionesProvider>
                </PersonasProvider>
            </UserProfileProvider>
        </AuthProvider>
    );
}
