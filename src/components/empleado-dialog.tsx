"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EmpleadoForm } from "./empleado-form";
import type { Empleado } from "@/contexts/PersonasContext";

interface EmpleadoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empleadoToEdit?: Empleado;
}

export function EmpleadoDialog({
    open,
    onOpenChange,
    empleadoToEdit,
}: EmpleadoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] min-w-[50vw] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {empleadoToEdit ? "Editar Empleado" : "Nuevo Empleado"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete los datos del empleado. Los campos marcados con * son
                        obligatorios.
                    </DialogDescription>
                </DialogHeader>
                <EmpleadoForm
                    empleadoToEdit={empleadoToEdit}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
