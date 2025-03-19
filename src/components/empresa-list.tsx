"use client";

import type React from "react";

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
import { usePersonas, type Empresa } from "@/contexts/PersonasContext";
import { EmpresaDialog } from "./empresa-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EmpresaListProps {
    onSelectEmpresa?: (empresa: Empresa) => void;
}

export function EmpresaList({ onSelectEmpresa }: EmpresaListProps) {
    const { empresas, deleteEmpresa } = usePersonas();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | undefined>();
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

    const handleEdit = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedEmpresa(undefined);
        setDialogOpen(true);
    };

    const handleRowClick = (empresa: Empresa) => {
        setSelectedId(empresa.id);
        onSelectEmpresa?.(empresa);
    };

    const handleDelete = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        deleteEmpresa(id);
        toast.success("Empresa eliminada", {
            description: "La empresa se ha eliminado correctamente.",
        });
        if (selectedId === id) {
            setSelectedId(undefined);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Empresas</h2>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Empresa
                </Button>
            </div>

            <div className="border rounded-lg w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Razón Social</TableHead>
                            <TableHead>CUIT</TableHead>
                            <TableHead>Localidad</TableHead>
                            <TableHead>Provincia</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empresas.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    No hay empresas registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            empresas.map((empresa) => (
                                <TableRow
                                    key={empresa.id}
                                    onClick={() => handleRowClick(empresa)}
                                    className={`cursor-pointer ${
                                        selectedId === empresa.id ? "bg-muted" : ""
                                    }`}
                                >
                                    <TableCell>{empresa.nombre}</TableCell>
                                    <TableCell>{empresa.razonSocial}</TableCell>
                                    <TableCell>{empresa.cuit}</TableCell>
                                    <TableCell>
                                        {empresa.domicilio.localidad}
                                    </TableCell>
                                    <TableCell>
                                        {empresa.domicilio.provincia}
                                    </TableCell>
                                    <TableCell className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(empresa)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleDelete(empresa.id, e)}
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

            <EmpresaDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                empresaToEdit={selectedEmpresa}
            />
        </div>
    );
}
