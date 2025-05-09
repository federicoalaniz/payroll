"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type User = {
    userId: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    login: (userId: string, password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const users = [
    { userId: "smguerrero", password: "1234", name: "Betty" },
    { userId: "aoalaniz", password: "1234", name: "Orlando" },
    { userId: "falaniz", password: "Gifedeagos.00", name: "Federico" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch {
                console.error("Invalid user data in localStorage");
                localStorage.removeItem("user"); // Clear invalid data
            }
        }
    }, []);

    const login = (userId: string, password: string) => {
        const foundUser = users.find(
            (u) => u.userId === userId && u.password === password
        );
        if (foundUser) {
            const {  ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem("user", JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
