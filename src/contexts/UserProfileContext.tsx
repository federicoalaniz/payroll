"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

type UserProfile = {
    userId: string;
    name: string;
    lastName: string;
    email: string;
    photo: string;
};

type UserProfileContextType = {
    userProfile: UserProfile | null;
    updateProfile: (profile: Partial<UserProfile>) => void;
    updatePassword: (currentPassword: string, newPassword: string) => boolean;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (user) {
            // Intentar cargar el perfil del usuario desde localStorage
            const storedProfile = localStorage.getItem(`profile_${user.userId}`);
            if (storedProfile) {
                try {
                    const parsedProfile = JSON.parse(storedProfile);
                    setUserProfile(parsedProfile);
                } catch {
                    console.error("Invalid profile data in localStorage");
                    // Inicializar con datos básicos del usuario actual
                    initializeProfile(user.userId, user.name);
                }
            } else {
                // Si no existe perfil, inicializar con datos básicos
                initializeProfile(user.userId, user.name);
            }
        } else {
            setUserProfile(null);
        }
    }, [user]);

    const initializeProfile = (userId: string, name: string) => {
        const initialProfile: UserProfile = {
            userId,
            name,
            lastName: "",
            email: "",
            photo: "",
        };
        setUserProfile(initialProfile);
        localStorage.setItem(`profile_${userId}`, JSON.stringify(initialProfile));
    };

    const updateProfile = (profile: Partial<UserProfile>) => {
        if (!userProfile || !user) return;

        const updatedProfile = { ...userProfile, ...profile };
        setUserProfile(updatedProfile);
        localStorage.setItem(`profile_${user.userId}`, JSON.stringify(updatedProfile));
    };

    const updatePassword = (currentPassword: string, newPassword: string) => {
        // En una aplicación real, esto enviaría una solicitud al servidor
        // Para este ejemplo, simplemente simulamos una verificación
        // Nota: Esta implementación es solo para demostración
        // En un entorno real, nunca manejes contraseñas en el cliente
        
        // Simulamos verificación de contraseña actual

        const isCurrentPasswordValid = true; // Simulado
        
        if (isCurrentPasswordValid) {
            // Simulamos actualización exitosa
            currentPassword = newPassword;
            localStorage.setItem(`profile_${user?.userId}`, JSON.stringify(userProfile));
            return true;
        }
        return false;
    };

    return (
        <UserProfileContext.Provider value={{ userProfile, updateProfile, updatePassword }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error("useUserProfile must be used within a UserProfileProvider");
    }
    return context;
};