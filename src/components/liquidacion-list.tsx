"use client";

import type React from "react";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, FileEdit } from "lucide-react";
import {
    useLiquidaciones,
    type Liquidacion,
} from "@/contexts/LiquidacionesContext";
import { usePersonas } from "@/contexts/PersonasContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LiquidacionListProps {
    onSelectLiquidacion: (liquidacion: Liquidacion | null) => void;
}

export function LiquidacionList({ onSelectLiquidacion }: LiquidacionListProps) {
    const { liquidaciones, deleteLiquidacion } = useLiquidaciones();
    const { empleados } = usePersonas();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filtroEmpleadoId, setFiltroEmpleadoId] = useState<string>("");

    const getEmpleadoNombre = (empleadoId: string) => {
        const empleado = empleados.find((e) => e.id === empleadoId);
        return empleado ? empleado.nombre : "N/A";
    };

    const handleRowClick = (liquidacion: Liquidacion) => {
        setSelectedId(liquidacion.id);
        onSelectLiquidacion(liquidacion);
    };

    const handleDelete = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        deleteLiquidacion(id);
        if (selectedId === id) {
            setSelectedId(null);
            onSelectLiquidacion(null);
        }
    };

    const handleEdit = (liquidacion: Liquidacion, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedId(liquidacion.id);
        onSelectLiquidacion(liquidacion);
    };

    const liquidacionesFiltradas = filtroEmpleadoId
        ? liquidaciones.filter((l) => l.empleadoId === filtroEmpleadoId)
        : liquidaciones;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Liquidaciones</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Label htmlFor="filtroEmpleado">Filtrar por empleado</Label>
                    <Select
                        value={filtroEmpleadoId}
                        onValueChange={setFiltroEmpleadoId}
                    >
                        <SelectTrigger id="filtroEmpleado">
                            <SelectValue placeholder="Todos los empleados" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos los empleados
                            </SelectItem>
                            {empleados.map((empleado) => (
                                <SelectItem
                                    key={empleado.id}
                                    value={empleado.id}
                                >
                                    {empleado.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableCaption>Lista de liquidaciones</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Empleado</TableHead>
                            <TableHead>Período</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">
                                Sueldo Neto
                            </TableHead>
                            <TableHead className="text-center">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {liquidacionesFiltradas.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-4"
                                >
                                    No hay liquidaciones registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            liquidacionesFiltradas.map((liquidacion) => (
                                <TableRow
                                    key={liquidacion.id}
                                    onClick={() => handleRowClick(liquidacion)}
                                    className={`cursor-pointer ${
                                        selectedId === liquidacion.id
                                            ? "bg-muted"
                                            : ""
                                    }`}
                                >
                                    <TableCell>
                                        {getEmpleadoNombre(
                                            liquidacion.empleadoId
                                        )}
                                    </TableCell>
                                    <TableCell>{liquidacion.periodo}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            liquidacion.fecha
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {liquidacion.totalNeto}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) =>
                                                    handleEdit(liquidacion, e)
                                                }
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FileEdit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) =>
                                                    handleDelete(
                                                        liquidacion.id,
                                                        e
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
