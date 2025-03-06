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
import Navbar from "@/components/Navbar"

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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Lista de Empresas */}
                    <Card className="md:col-span-1">
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
                                            className={`cursor-pointer ${
                                                selectedEmpresa?.id ===
                                                empresa.id
                                                    ? "bg-muted"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelectEmpresa(empresa)
                                            }
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
                        <Card className="md:col-span-1">
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
                                        {empleadosFiltrados.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={2}
                                                    className="text-center py-4"
                                                >
                                                    No hay empleados registrados
                                                    para esta empresa
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            empleadosFiltrados.map(
                                                (empleado) => (
                                                    <TableRow
                                                        key={empleado.id}
                                                        className={`cursor-pointer ${
                                                            selectedEmpleado?.id ===
                                                            empleado.id
                                                                ? "bg-muted"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleSelectEmpleado(
                                                                empleado
                                                            )
                                                        }
                                                    >
                                                        <TableCell>
                                                            {empleado.nombre}
                                                        </TableCell>
                                                        <TableCell>
                                                            {empleado.cuil}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Liquidaciones del Empleado */}
                    {selectedEmpleado && (
                        <Card className="md:col-span-2 lg:col-span-3">
                            <EmpleadoLiquidaciones
                                empleadoId={selectedEmpleado.id}
                                empleadoNombre={selectedEmpleado.nombre}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
