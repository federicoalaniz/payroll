"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(userId, password)) {
            router.push("/");
        } else {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Iniciar sesión</h2>
                    <p className="text-sm text-muted-foreground mt-2">Ingresa tus credenciales para acceder al sistema</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId">Usuario</Label>
                            <Input
                                id="userId"
                                name="userId"
                                type="text"
                                required
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Usuario"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive text-center">
                            {error}
                        </p>
                    )}

                    <Button type="submit" className="w-full">
                        Iniciar sesión
                    </Button>
                </form>
            </div>
        </div>
    );
}
