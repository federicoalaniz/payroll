"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Building2,
    ChevronDown,
    FileText,
    LogOut,
    Moon,
    Settings,
    Sun,
    User,
    Users,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            return (savedTheme as "light" | "dark") || systemTheme;
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 border-b bg-background">
            <div className="flex h-16 items-center px-4 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-2 font-semibold">
                    <Building2 className="h-6 w-6" />
                    <span className="hidden md:inline-block">
                        Sistema de Gestión
                    </span>
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-2 md:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Menú</SheetTitle>
                            <SheetDescription>
                                Navegue por las diferentes secciones del
                                sistema.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <Link
                                href="/personas"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                onClick={() => setIsOpen(false)}
                            >
                                <Users className="h-4 w-4" />
                                Personas
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                                    <FileText className="h-4 w-4" />
                                    Liquidaciones
                                </div>
                                <div className="ml-6 grid gap-1">
                                    <Link
                                        href="/liquidaciones/sueldos"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sueldos y jornales
                                    </Link>
                                    <Link
                                        href="/liquidaciones/sac"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sueldo anual complementario
                                    </Link>
                                    <Link
                                        href="/liquidaciones/vacaciones"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Vacaciones
                                    </Link>
                                    <Link
                                        href="/liquidaciones/final"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Liquidación final
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                                    <FileText className="h-4 w-4" />
                                    Informes
                                </div>
                                <div className="ml-6 grid gap-1">
                                    <Link
                                        href="/informes/recibos"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Imprimir Recibos
                                    </Link>
                                    <Link
                                        href="/informes/empleador"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Informe por Empleador
                                    </Link>
                                    <Link
                                        href="/informes/empleado"
                                        className="rounded-md px-3 py-1 text-sm hover:bg-accent"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Informe por Empleado
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Menu */}
                <Menubar className="ml-4 hidden border-none md:flex">
                    <MenubarMenu>
                        <MenubarTrigger className="font-medium">
                            <Link
                                href="/personas"
                                className="flex items-center gap-1"
                            >
                                <Users className="h-4 w-4" />
                                Personas
                            </Link>
                        </MenubarTrigger>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger className="flex items-center gap-1 font-medium">
                            <FileText className="h-4 w-4" />
                            Liquidaciones
                            <ChevronDown className="h-4 w-4" />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link
                                    href="/liquidaciones/sueldos"
                                    className="flex w-full"
                                >
                                    Sueldos y jornales
                                </Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link
                                    href="/liquidaciones/sac"
                                    className="flex w-full"
                                >
                                    Sueldo anual complementario
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <Link
                                    href="/liquidaciones/vacaciones"
                                    className="flex w-full"
                                >
                                    Vacaciones
                                </Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link
                                    href="/liquidaciones/final"
                                    className="flex w-full"
                                >
                                    Liquidación final
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger className="flex items-center gap-1 font-medium">
                            <FileText className="h-4 w-4" />
                            Informes
                            <ChevronDown className="h-4 w-4" />
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link
                                    href="/informes/recibos"
                                    className="flex w-full"
                                >
                                    Imprimir Recibos
                                </Link>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                <Link
                                    href="/informes/empleador"
                                    className="flex w-full"
                                >
                                    Informe por Empleador
                                </Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link
                                    href="/informes/empleado"
                                    className="flex w-full"
                                >
                                    Informe por Empleado
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>

                    {/* Opciones genéricas para futuro */}
                    <MenubarMenu>
                        <MenubarTrigger className="font-medium">
                            Configuración
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link
                                    href="/configuracion/general"
                                    className="flex w-full"
                                >
                                    General
                                </Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link
                                    href="/configuracion/parametros"
                                    className="flex w-full"
                                >
                                    Parámetros
                                </Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>

                {/* User Section */}
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="/placeholder.svg"
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.userId}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configuración</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/login")}
                        >
                            Iniciar sesión
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
