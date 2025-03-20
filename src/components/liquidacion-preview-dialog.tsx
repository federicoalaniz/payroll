"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ResumenLiquidacion } from "@/components/resumen-liquidacion";
import { Liquidacion } from "@/contexts/LiquidacionesContext";
import {
    calculateYearsOfService,
    calculateSeniorityAmount,
    calculateAmount,
    calculateTotalRemunerative,
    calculateTotalNonRemunerative,
    calculateDeductionTotals,
    calculateTotalNeto
} from "@/lib/utils";
import { LiquidacionHeader } from "@/components/liquidacion-header";
import { formatDate } from "@/lib/utils";

interface LiquidacionPreviewDialogProps {
    liquidacion: Liquidacion;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LiquidacionPreviewDialog({
    liquidacion,
    open,
    onOpenChange,
}: LiquidacionPreviewDialogProps) {
    const getYearsOfService = () => {
        return calculateYearsOfService(liquidacion.startDate);
    };

    const getSeniorityAmount = () => {
        return calculateSeniorityAmount(liquidacion.basicSalary, calculateYearsOfService(liquidacion.startDate));
    };

    const getAmount = (percentage: string, base: string, isRemunerative: boolean) => {
        return calculateAmount(percentage, base, isRemunerative);
    };

    const getTotalRemunerative = () => {
        return calculateTotalRemunerative(liquidacion.basicSalary, liquidacion.rowsRemunerative);
    };

    const getTotalNonRemunerative = () => {
        return calculateTotalNonRemunerative(liquidacion.rowsNonRemunerative);
    };

    const getDeductionTotals = () => {
        return calculateDeductionTotals(
            liquidacion.deductionItems,
            getTotalRemunerative(),
            getTotalNonRemunerative()
        );
    };

    const getTotalNeto = () => {
        const deductionTotals = getDeductionTotals();
        return calculateTotalNeto(
            getTotalRemunerative(),
            getTotalNonRemunerative(),
            deductionTotals.remunerative,
            deductionTotals.nonRemunerative
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] min-w-[70vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {" "}
                        Liquidación - {liquidacion.periodo}
                    </DialogTitle>
                </DialogHeader>
                <LiquidacionHeader empleadoId={liquidacion.empleadoId} />
                <div className="text-black flex justify-between px-4">
                    <p><strong>Período liquidado:</strong> {liquidacion.periodo}</p>
                    <p><strong>Fecha de liquidación:</strong> {formatDate(liquidacion.fecha)}</p>
                </div>
                <ResumenLiquidacion
                    basicSalary={liquidacion.basicSalary}
                    calculateYearsOfService={getYearsOfService}
                    calculateSeniorityAmount={getSeniorityAmount}
                    presentismoPercentage={liquidacion.presentismoPercentage}
                    calculateAmount={getAmount}
                    rowsRemunerative={liquidacion.rowsRemunerative}
                    rowsNonRemunerative={liquidacion.rowsNonRemunerative.map(
                        (item) => ({
                            ...item,
                            isAttendanceRow: item.isAttendanceRow || false,
                            isSeniorityRow: item.isSeniorityRow || false,
                        })
                    )}
                    deductionItems={liquidacion.deductionItems}
                    calculateTotalRemunerative={getTotalRemunerative}
                    calculateTotalNonRemunerative={getTotalNonRemunerative}
                    calculateDeductionTotals={getDeductionTotals}
                    calculateTotalNeto={getTotalNeto}
                />
            </DialogContent>
        </Dialog>
    );
}