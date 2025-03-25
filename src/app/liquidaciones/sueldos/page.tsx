"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    usePersonas,
    type Empresa,
    type Empleado,
} from "@/contexts/PersonasContext";
import { EmpleadoLiquidaciones } from "@/components/empleado-liquidaciones";
import Navbar from "@/components/navigationbar";

export default function LiquidacionesSueldosPage() {
    const { empresas, empleados } = usePersonas();
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(
        null
    );
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
        null
    );

    const handleSelectEmpresa = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setSelectedEmpleado(null);
    };

    const handleSelectEmpleado = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
    };

    const empleadosFiltrados = selectedEmpresa
        ? empleados.filter(
              (empleado) => empleado.empresaId === selectedEmpresa.id
          )
        : [];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto py-10 pt-16">
                <h1 className="text-3xl font-bold mb-6">
                    Liquidación de Sueldos y Jornales
                </h1>

                <div className="flex gap-6 mb-6">
                    {/* Lista de Empresas */}
                    <Card className="w-1/2 flex-grow">
                        <CardHeader>
                            <CardTitle>Empresas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>
                                    Seleccione una empresa
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>CUIT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {empresas.map((empresa) => (
                                        <TableRow
                                            key={empresa.id}
                                            className={`cursor-pointer ${selectedEmpresa?.id === empresa.id ? "bg-green-100 dark:bg-green-900/20" : "hover:bg-accent"}`}
                                            onClick={() => handleSelectEmpresa(empresa)}
                                        >
                                            <TableCell>
                                                {empresa.nombre}
                                            </TableCell>
                                            <TableCell>
                                                {empresa.cuit}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Lista de Empleados */}
                    {selectedEmpresa && (
                        <Card className="w-1/2 flex-grow">
                            <CardHeader>
                                <CardTitle>
                                    Empleados de {selectedEmpresa.nombre}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>
                                        Seleccione un empleado
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>CUIL</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {empleadosFiltrados.map((empleado) => (
                                            <TableRow
                                                key={empleado.id}
                                                className={`cursor-pointer ${selectedEmpleado?.id === empleado.id ? "bg-green-100 dark:bg-green-900/20" : "hover:bg-accent"}`}
                                                onClick={() =>
                                                    handleSelectEmpleado(empleado)
                                                }
                                            >
                                                <TableCell>
                                                    {empleado.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    {empleado.cuil}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Lista de Liquidaciones */}
                {selectedEmpleado && (
                    <EmpleadoLiquidaciones
                        empleadoId={selectedEmpleado.id}
                        empleadoNombre={selectedEmpleado.nombre}
                    />
                )}
            </div>
        </div>
    );
}

