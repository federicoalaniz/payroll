"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmpresaForm } from "@/components/empresa-form";
import { EmpleadoForm } from "@/components/empleado-form";
import { EmpresaList } from "@/components/empresa-list";
import { EmpleadoList } from "@/components/empleado-list";
import type { Empresa, Empleado } from "@/contexts/PersonasContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function PersonasPage() {
    const [activeTab, setActiveTab] = useState<"empresas" | "empleados">(
        "empresas"
    );
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(
        null
    );
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
        null
    );

    const handleSelectEmpresa = (empresa: Empresa | null) => {
        setSelectedEmpresa(empresa);
    };

    const handleSelectEmpleado = (empleado: Empleado | null) => {
        setSelectedEmpleado(empleado);
    };

    const handleSubmitSuccess = () => {
        setSelectedEmpresa(null);
        setSelectedEmpleado(null);
    };

    const handleNewItem = () => {
        if (activeTab === "empresas") {
            setSelectedEmpresa(null);
        } else {
            setSelectedEmpleado(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto py-10 pt-16">
                <h1 className="text-3xl font-bold mb-6">Gestión de Personas</h1>
                <Tabs
                    defaultValue="empresas"
                    onValueChange={(value) =>
                        setActiveTab(value as "empresas" | "empleados")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="empresas">Empresas</TabsTrigger>
                        <TabsTrigger value="empleados">Empleados</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">
                            {activeTab === "empresas"
                                ? "Empresas"
                                : "Empleados"}
                        </h2>
                        <Button onClick={handleNewItem}>
                            Nuevo{" "}
                            {activeTab === "empresas" ? "Empresa" : "Empleado"}
                        </Button>
                    </div>
                    <TabsContent value="empresas">
                        <div className="grid gap-6 md:grid-cols-2">
                            <EmpresaForm
                                empresaToEdit={selectedEmpresa}
                                onSubmitSuccess={handleSubmitSuccess}
                            />
                            <EmpresaList
                                onSelectEmpresa={handleSelectEmpresa}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="empleados">
                        <div className="grid gap-6 md:grid-cols-2">
                            <EmpleadoForm
                                empleadoToEdit={selectedEmpleado}
                                onSubmitSuccess={handleSubmitSuccess}
                            />
                            <EmpleadoList
                                onSelectEmpleado={handleSelectEmpleado}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
