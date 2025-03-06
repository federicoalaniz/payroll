"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash2, Plus } from "lucide-react";
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
    useLiquidaciones,
    type Liquidacion,
} from "@/contexts/LiquidacionesContext";
import { LiquidacionDialog } from "@/components/liquidacion-dialog";

interface EmpleadoLiquidacionesProps {
    empleadoId: string;
    empleadoNombre: string;
}

export function EmpleadoLiquidaciones({
    empleadoId,
    empleadoNombre,
}: EmpleadoLiquidacionesProps) {
    const { liquidaciones, deleteLiquidacion, getLiquidacionesByEmpleado } =
        useLiquidaciones();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLiquidacion, setSelectedLiquidacion] =
        useState<Liquidacion | null>(null);

    const liquidacionesEmpleado = getLiquidacionesByEmpleado(empleadoId);

    const handleNewLiquidacion = () => {
        setSelectedLiquidacion(null);
        setIsDialogOpen(true);
    };

    const handleEditLiquidacion = (liquidacion: Liquidacion) => {
        setSelectedLiquidacion(liquidacion);
        setIsDialogOpen(true);
    };

    const handleDeleteLiquidacion = (id: string) => {
        deleteLiquidacion(id);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedLiquidacion(null);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Liquidaciones de {empleadoNombre}</CardTitle>
                <Button onClick={handleNewLiquidacion}>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Liquidación
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>Liquidaciones del empleado</TableCaption>
                    <TableHeader>
                        <TableRow>
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
                        {liquidacionesEmpleado.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-4"
                                >
                                    No hay liquidaciones registradas para este
                                    empleado
                                </TableCell>
                            </TableRow>
                        ) : (
                            liquidacionesEmpleado.map((liquidacion) => (
                                <TableRow key={liquidacion.id}>
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
                                                onClick={() =>
                                                    handleEditLiquidacion(
                                                        liquidacion
                                                    )
                                                }
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FileEdit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteLiquidacion(
                                                        liquidacion.id
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

            <LiquidacionDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                liquidacionToEdit={selectedLiquidacion}
                empleadoId={empleadoId}
            />
        </Card>
    );
}
