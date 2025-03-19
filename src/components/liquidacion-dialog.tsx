"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from "@/components/ui/dialog";
import { LiquidacionForm } from "@/components/liquidacion-form";
import { Liquidacion } from "@/contexts/LiquidacionesContext";

interface LiquidacionDialogProps {
    title: string;
    empleadoId?: string;
    liquidacion?: Liquidacion;
    onSuccess: () => void;
    trigger?: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LiquidacionDialog({
    title,
    empleadoId,
    liquidacion,
    onSuccess,
    open,
    onOpenChange,
}: LiquidacionDialogProps) {
    const handleSuccess = () => {
        onOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        Nueva Liquidación
                    </Button>
                )}
            </DialogTrigger> */}
            <DialogContent className="max-w-[95vw] min-w-[70vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <LiquidacionForm
                    empleadoId={empleadoId}
                    liquidacionToEdit={liquidacion}
                    onSubmitSuccess={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}
