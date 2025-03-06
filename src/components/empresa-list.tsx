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
import { usePersonas, type Empresa } from "@/contexts/PersonasContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EmpresaListProps {
    onSelectEmpresa: (empresa: Empresa) => void;
}

export function EmpresaList({ onSelectEmpresa }: EmpresaListProps) {
    const { empresas, deleteEmpresa } = usePersonas();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleRowClick = (empresa: Empresa) => {
        setSelectedId(empresa.id);
        onSelectEmpresa(empresa);
    };

    const handleDelete = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        deleteEmpresa(id);
        toast.success("Empresa eliminada", {
            description: "La empresa se ha eliminado correctamente.",
        });
        if (selectedId === id) {
            setSelectedId(null);
            onSelectEmpresa(null);
        }
    };

    return (
        <Table>
            <TableCaption>Lista de empresas registradas</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Razón Social</TableHead>
                    <TableHead>CUIT</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {empresas.map((empresa) => (
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
                        <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDelete(empresa.id, e)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
