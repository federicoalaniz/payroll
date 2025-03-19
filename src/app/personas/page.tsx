"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmpresaList } from "@/components/empresa-list";
import { EmpleadoList } from "@/components/empleado-list";
import Navbar from "@/components/Navbar";
// import Navbar from "@/components/Navbar";

export default function PersonasPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto py-6">
                    <h1 className="text-3xl font-bold mb-6">Gestión de Personas</h1>
                    <Tabs defaultValue="empresas">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="empresas">Empresas</TabsTrigger>
                            <TabsTrigger value="empleados">Empleados</TabsTrigger>
                        </TabsList>
                        <TabsContent value="empresas">
                            <EmpresaList />
                        </TabsContent>
                        <TabsContent value="empleados">
                            <EmpleadoList />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
