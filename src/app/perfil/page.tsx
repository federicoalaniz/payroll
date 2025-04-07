"use client";

import { useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function PerfilPage() {
    const { userProfile, updateProfile, updatePassword } = useUserProfile();
    
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        lastName: userProfile?.lastName || "",
        email: userProfile?.email || "",
        photo: userProfile?.photo || ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateProfileForm = () => {
        let isValid = true;
        const newErrors = {...errors};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
            isValid = false;
        } else {
            newErrors.name = "";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "El apellido es requerido";
            isValid = false;
        } else {
            newErrors.lastName = "";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El correo electrónico es requerido";
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Formato de correo electrónico inválido";
            isValid = false;
        } else {
            newErrors.email = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const validatePasswordForm = () => {
        let isValid = true;
        const newErrors = {...errors};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "La contraseña actual es requerida";
            isValid = false;
        } else {
            newErrors.currentPassword = "";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "La nueva contraseña es requerida";
            isValid = false;
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
            isValid = false;
        } else {
            newErrors.newPassword = "";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Confirme la nueva contraseña";
            isValid = false;
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
            isValid = false;
        } else {
            newErrors.confirmPassword = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateProfileForm()) {
            updateProfile(formData);
            toast.success("Perfil actualizado correctamente");
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validatePasswordForm()) {
            const success = updatePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            if (success) {
                toast.success("Contraseña actualizada correctamente");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                toast.error("Error al actualizar la contraseña. Verifique la contraseña actual.");
            }
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({
                    ...prev,
                    photo: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userProfile) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p>Debe iniciar sesión para ver esta página</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
            
            <Tabs defaultValue="informacion">
                <TabsList className="mb-4">
                    <TabsTrigger value="informacion">Información Personal</TabsTrigger>
                    <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                </TabsList>
                
                <TabsContent value="informacion">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                                <CardDescription>
                                    Actualice su información personal aquí.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleProfileSubmit}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Apellido</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                            {errors.lastName && (
                                                <p className="text-sm text-red-500">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="mt-5">
                                    <Button type="submit">Guardar Cambios</Button>
                                </CardFooter>
                            </form>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Foto de Perfil</CardTitle>
                                <CardDescription>
                                    Actualice su foto de perfil aquí.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage 
                                        src={formData.photo || "/default-avatar.png"} 
                                        alt="Foto de perfil" 
                                    />
                                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="w-full">
                                    <Label htmlFor="photo" className="block mb-2">Seleccionar nueva foto</Label>
                                    <Input
                                        id="photo"
                                        name="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="seguridad">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cambiar Contraseña</CardTitle>
                            <CardDescription>
                                Actualice su contraseña para mantener su cuenta segura.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePasswordSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-sm text-red-500">{errors.currentPassword}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.newPassword && (
                                        <p className="text-sm text-red-500">{errors.newPassword}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="mt-5">
                                <Button type="submit">Cambiar Contraseña</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}