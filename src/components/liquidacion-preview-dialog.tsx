"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Liquidacion } from "@/contexts/LiquidacionesContext";
import { formatDate, formatNumber, formatAmountInWords } from "@/lib/utils";
import { LiquidacionHeader } from "@/components/liquidacion-header";
import { Download, Printer } from "lucide-react";
import { generateLiquidacionPDF } from "@/lib/pdf-generator";
import { Button } from "@/components/ui/button";
import { usePersonas } from "@/contexts/PersonasContext";

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
    console.log(liquidacion)
    
    // Get employee data from context
    const { empleados, empresas } = usePersonas();
    const empleado = empleados.find(e => e.id === liquidacion.empleadoId);
    const empresa = empleado ? empresas.find(e => e.id === empleado.empresaId) : undefined;

    const formatPeriodType = (type: string | undefined) => {
        switch (type) {
            case "quincena1":
                return "- Primera Quincena";
            case "quincena2":
                return "- Segunda Quincena";
            default:
                return "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] min-w-[70vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>
                        {" "}
                        Liquidación de Haberes
                    </DialogTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={async () => {
                            const employeeInfo = {
                                name: empleado?.nombre || '',
                                cuil: empleado?.cuil || '',
                                address: empleado?.domicilio ? `${empleado.domicilio.calle} ${empleado.domicilio.numero}, ${empleado.domicilio.localidad}, ${empleado.domicilio.provincia}` : '',
                                startDate: empleado?.fechaIngreso || '',
                                category: empleado?.categoria || '',
                                empresaNombre: empresa?.nombre || '',
                                empresaCuit: empresa?.cuit || '',
                                empresaDomicilio: empresa?.domicilio ? `${empresa.domicilio.calle} ${empresa.domicilio.numero}, ${empresa.domicilio.localidad}, ${empresa.domicilio.provincia}` : ''
                            };
                            const doc = await generateLiquidacionPDF(liquidacion, employeeInfo);
                            doc.save(`liquidacion-${liquidacion.periodo}.pdf`);
                        }}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={async () => {
                            const employeeInfo = {
                                name: empleado?.nombre || '',
                                cuil: empleado?.cuil || '',
                                address: empleado?.domicilio ? `${empleado.domicilio.calle} ${empleado.domicilio.numero}, ${empleado.domicilio.localidad}, ${empleado.domicilio.provincia}` : '',
                                startDate: empleado?.fechaIngreso || '',
                                category: empleado?.categoria || '',
                                empresaNombre: empresa?.nombre || '',
                                empresaCuit: empresa?.cuit || '',
                                empresaDomicilio: empresa?.domicilio ? `${empresa.domicilio.calle} ${empresa.domicilio.numero}, ${empresa.domicilio.localidad}, ${empresa.domicilio.provincia}` : ''
                            };
                            const doc = await generateLiquidacionPDF(liquidacion, employeeInfo);
                            // Convertir el PDF a blob y abrir en nueva pestaña
                            const pdfBlob = doc.output('blob');
                            const blobUrl = URL.createObjectURL(pdfBlob);
                            window.open(blobUrl, '_blank');
                        }}>
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>
                <LiquidacionHeader empleadoId={liquidacion.empleadoId} />
                <div className="text-black flex justify-between px-4">
                    <p><strong>Período liquidado:</strong> {`${liquidacion.periodo} ${formatPeriodType(liquidacion.periodoObj?.type)}`} </p>
                    <p><strong>Fecha de liquidación:</strong> {formatDate(liquidacion.fecha)}</p>
                </div>
                
                <div className="p-6 rounded-lg border-2 border-gray-500 space-y-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-500">
                                    <th rowSpan={2} className="text-left py-2 ">
                                        Concepto
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="text-center py-2 border-r-2 border-gray-500"
                                    >
                                        Haberes
                                    </th>
                                    <th colSpan={2} className="text-center py-2">
                                        Deducciones
                                    </th>
                                </tr>
                                <tr className="border-b-2 border-gray-500">
                                    <th className="text-right py-2 px-4 w-[220px]">
                                        Remunerativo
                                    </th>
                                    <th className="text-right py-2 px-4 w-[220px] border-r-2 border-gray-500">
                                        No Remunerativo
                                    </th>
                                    <th className="text-right py-2 px-4 w-[220px]">
                                        Remunerativo
                                    </th>
                                    <th className="text-right py-2 px-4 w-[220px]">
                                        No Remunerativo
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">Sueldo básico</td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.basicSalary)}
                                    </td>
                                    <td className="text-right px-4 border-r-2 border-gray-500">
                                        -
                                    </td>
                                    <td className="text-right px-4">-</td>
                                    <td className="text-right px-4">-</td>
                                </tr>
                                <tr>
                                    <td className="py-2">
                                        Antigüedad ({liquidacion.rowsNonRemunerative.find(item => item.isSeniorityRow)?.percentage || '0'} años)
                                    </td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.antiguedadAmount)}
                                    </td>
                                    <td className="text-right px-4 border-r-2 border-gray-500">
                                        -
                                    </td>
                                    <td className="text-right px-4">-</td>
                                    <td className="text-right px-4">-</td>
                                </tr>
                                <tr>
                                    <td className="py-2">
                                        Presentismo ({liquidacion.presentismoPercentage}%)
                                    </td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.presentismoAmount)}
                                    </td>
                                    <td className="text-right px-4 border-r-2 border-gray-500">
                                        -
                                    </td>
                                    <td className="text-right px-4">-</td>
                                    <td className="text-right px-4">-</td>
                                </tr>
                                {liquidacion.rowsRemunerative.map((row) => (
                                    <tr key={row.id}>
                                        <td className="py-2">
                                            {row.name}{" "}
                                            {row.checked && `(${row.percentage}%)`}
                                        </td>
                                        <td className="text-right px-4">
                                            {formatNumber(row.amount)}
                                        </td>
                                        <td className="text-right px-4 border-r-2 border-gray-500">
                                            -
                                        </td>
                                        <td className="text-right px-4">-</td>
                                        <td className="text-right px-4">-</td>
                                    </tr>
                                ))}
                                {liquidacion.rowsNonRemunerative
                                    .filter(row => !row.isAttendanceRow && !row.isSeniorityRow)
                                    .map((row) => (
                                    <tr key={row.id}>
                                        <td className="py-2">
                                            {row.name}{" "}
                                            {(row.isAttendanceRow ||
                                                row.isSeniorityRow) &&
                                                `(${row.percentage}%)`}
                                        </td>
                                        <td className="text-right px-4">-</td>
                                        <td className="text-right px-4 border-r-2 border-gray-500">
                                            {formatNumber(row.amount)}
                                        </td>
                                        <td className="text-right px-4">-</td>
                                        <td className="text-right px-4">-</td>
                                    </tr>
                                ))}
                                {liquidacion.deductionItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2">
                                            {item.name}{" "}
                                            {(item.checkedRemunerative ||
                                                item.checkedNonRemunerative) &&
                                                `(${item.percentage}%)`}
                                        </td>
                                        <td className="text-right px-4">-</td>
                                        <td className="text-right px-4 border-r-2 border-gray-500">
                                            -
                                        </td>
                                        <td className="text-right px-4">
                                            {item.remunerativeAmount && parseFloat(item.remunerativeAmount.replace(",", ".")) > 0
                                                ? formatNumber(item.remunerativeAmount)
                                                : `-`}
                                        </td>
                                        <td className="text-right px-4">
                                            {item.nonRemunerativeAmount && parseFloat(item.nonRemunerativeAmount.replace(",", ".")) > 0
                                                ? formatNumber(item.nonRemunerativeAmount)
                                                : `-`}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-gray-500 font-bold">
                                    <td className="py-2">Subtotales</td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.totalRemunerativo)}
                                    </td>
                                    <td className="text-right px-4 border-r-2 border-gray-500">
                                        {formatNumber(liquidacion.totalNoRemunerativo)}
                                    </td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.deduccionesRemunerativas)}
                                    </td>
                                    <td className="text-right px-4">
                                        {formatNumber(liquidacion.deduccionesNoRemunerativas)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totales Finales */}
                    <div className="space-y-4 pt-4 border-t-2 border-gray-500">
                        <div className="flex justify-between items-center text-xl font-semibold text-muted-foreground">
                            <span>Sueldo Bruto</span>
                            <span>
                                {formatNumber(liquidacion.sueldoBruto)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-semibold text-muted-foreground">
                            <span>Deducciones</span>
                            <span>
                                {formatNumber(liquidacion.totalDeducciones)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold">
                            <span>SUELDO NETO</span>
                            <span>{formatNumber(liquidacion.totalNeto)}</span>
                        </div>
                    </div>
                    
                    {/* Sección de Recibo */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-500">
                        <div className="space-y-4">
                            <p className="text-lg">Recibí la suma de pesos: <span className="font-semibold">{formatAmountInWords(liquidacion.totalNeto)}</span>.</p>
                            <p className="text-lg">Por los conceptos indicados en la presente liquidación, dejando constancia de haber recibido un duplicado de este recibo.</p>
                            <p className="text-lg font-semibold">Son pesos: {formatNumber(liquidacion.totalNeto)}</p>
                        </div>
                        
                        <div className="mt-10 flex justify-end">
                            <div className="w-64 border-t-2 border-black pt-2 text-center">
                                <p>Firma del empleado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}