"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LiquidacionForm } from "@/components/liquidacion-form";
import type { Liquidacion } from "@/contexts/LiquidacionesContext";

interface LiquidacionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    liquidacionToEdit: Liquidacion | null;
    empleadoId: string;
}

export function LiquidacionDialog({
    isOpen,
    onClose,
    liquidacionToEdit,
    empleadoId,
}: LiquidacionDialogProps) {
    const handleSubmitSuccess = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {liquidacionToEdit
                            ? "Editar Liquidación"
                            : "Nueva Liquidación"}
                    </DialogTitle>
                </DialogHeader>
                <LiquidacionForm
                    liquidacionToEdit={liquidacionToEdit}
                    onSubmitSuccess={handleSubmitSuccess}
                    empleadoId={empleadoId}
                />
            </DialogContent>
        </Dialog>
    );
}
