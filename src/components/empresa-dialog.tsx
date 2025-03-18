"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EmpresaForm } from "./empresa-form";
import type { Empresa } from "@/contexts/PersonasContext";

interface EmpresaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empresaToEdit?: Empresa;
}

export function EmpresaDialog({
    open,
    onOpenChange,
    empresaToEdit,
}: EmpresaDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] min-w-[60vw] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {empresaToEdit ? "Editar Empresa" : "Nueva Empresa"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete los datos de la empresa. Los campos marcados con * son
                        obligatorios.
                    </DialogDescription>
                </DialogHeader>
                <EmpresaForm
                    empresaToEdit={empresaToEdit}
                    onSubmitSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
