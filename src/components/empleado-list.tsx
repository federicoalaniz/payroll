"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePersonas, type Empleado } from "@/contexts/PersonasContext";
import { EmpleadoDialog } from "./empleado-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EmpleadoListProps {
    onSelectEmpleado?: (empleado: Empleado) => void;
}

export function EmpleadoList({ onSelectEmpleado }: EmpleadoListProps) {
    const { empleados, deleteEmpleado } = usePersonas();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>();

    const handleEdit = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedEmpleado(undefined);
        setDialogOpen(true);
    };

    const handleRowClick = (empleado: Empleado) => {
        setSelectedId(empleado.id);
        onSelectEmpleado?.(empleado);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteEmpleado(id);
            toast.success("Empleado eliminado", {
                description: "El empleado se eliminó correctamente.",
            });
            if (selectedId === id) {
                setSelectedId(undefined);
                setSelectedEmpleado(undefined);
            }
        } catch {
            toast.error("Error", {
                description: "Ocurrió un error al eliminar el empleado.",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Empleados</h2>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Empleado
                </Button>
            </div>

            <div className="border rounded-lg w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>CUIL</TableHead>
                            <TableHead>DNI</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Localidad</TableHead>
                            <TableHead>Provincia</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empleados.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    No hay empleados registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            empleados.map((empleado) => (
                                <TableRow
                                    key={empleado.id}
                                    onClick={() => handleRowClick(empleado)}
                                    className={`cursor-pointer ${
                                        selectedId === empleado.id ? "bg-muted" : ""
                                    }`}
                                >
                                    <TableCell>{empleado.nombre}</TableCell>
                                    <TableCell>{empleado.cuil}</TableCell>
                                    <TableCell>{empleado.dni}</TableCell>
                                    <TableCell>
                                        {empleado.categoria}
                                        {empleado.subCategoria &&
                                            ` - ${empleado.subCategoria}`}
                                    </TableCell>
                                    <TableCell>
                                        {empleado.domicilio?.localidad}
                                    </TableCell>
                                    <TableCell>
                                        {empleado.domicilio?.provincia}
                                    </TableCell>
                                    <TableCell className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(empleado);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleDelete(empleado.id, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <EmpleadoDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                empleadoToEdit={selectedEmpleado}
            />
        </div>
    );
}
