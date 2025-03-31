"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
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
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function LiquidacionDialog({
    title,
    empleadoId,
    liquidacion,
    onSuccess,
    // trigger,
    open,
    onOpenChange,
}: LiquidacionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    
    // Usar el estado controlado externamente si se proporciona, de lo contrario usar el estado interno
    const isOpen = open !== undefined ? open : internalOpen;
    const handleOpenChange = onOpenChange || setInternalOpen;

    const handleSuccess = () => {
        handleOpenChange(false);
        onSuccess();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
