"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePersonas } from "@/contexts/PersonasContext";
import { LiquidacionHeader } from "@/components/liquidacion-header";
import {
    useLiquidaciones,
    type Liquidacion,
    type SalaryItem,
    type NonRemunerativeItem,
    type DeductionItem,
} from "@/contexts/LiquidacionesContext";
import { toast } from "sonner";

const formatNumber = (value: string) => {
    if (!value) return "";

    // Elimina cualquier carácter no numérico excepto la coma
    value = value.replace(/[^0-9,]/g, "");

    // Si hay una coma, separamos la parte entera y decimal
    let [integer, decimal] = value.split(",");

    // Formateamos la parte entera con separadores de miles
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Si no hay parte decimal, se agrega ",00"
    if (!decimal) {
        decimal = "00";
    } else {
        // Si hay una parte decimal, la limitamos a 2 dígitos
        decimal = decimal.length === 1 ? `${decimal}0` : decimal.slice(0, 2);
    }

    // Retorna la parte entera con los decimales formateados
    return `${integer},${decimal}`;
};

interface LiquidacionFormProps {
    liquidacionToEdit?: Liquidacion | null;
    onSubmitSuccess: () => void;
    empleadoId?: string;
}

export function LiquidacionForm({
    liquidacionToEdit,
    onSubmitSuccess,
    empleadoId,
}: LiquidacionFormProps) {
    const { empleados } = usePersonas();
    const { addLiquidacion, updateLiquidacion } = useLiquidaciones();
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<string>(
        empleadoId || ""
    );
    const [periodo, setPeriodo] = useState<string>("");
    const [fecha, setFecha] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [basicSalary, setBasicSalary] = useState("");

    const [rowsRemunerative, setRowsRemunerative] = useState<SalaryItem[]>([]);
    const [rowsNonRemunerative, setRowsNonRemunerative] = useState<
        NonRemunerativeItem[]
    >([]);
    const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([]);
    const [presentismoPercentage, setPresentismoPercentage] = useState("8,33");
    const [isSubmitting, setIsSubmitting] = useState(false);

    



    const resetForm = useCallback(() => {
        if (!empleadoId) {
            setSelectedEmpleadoId("");
        }
        setPeriodo("");
        setFecha(new Date().toISOString().split("T")[0]);
        setBasicSalary("");

        setRowsRemunerative([]);
        setRowsNonRemunerative([]);
        setDeductionItems([]);
        setPresentismoPercentage("8,33");
    }, [empleadoId]);

    useEffect(() => {
        if (liquidacionToEdit) {
            setSelectedEmpleadoId(liquidacionToEdit.empleadoId);
            setPeriodo(liquidacionToEdit.periodo);
            setFecha(liquidacionToEdit.fecha);
            setBasicSalary(liquidacionToEdit.basicSalary);

            setRowsRemunerative(liquidacionToEdit.rowsRemunerative);
            setRowsNonRemunerative(liquidacionToEdit.rowsNonRemunerative);
            setDeductionItems(liquidacionToEdit.deductionItems);
            setPresentismoPercentage(liquidacionToEdit.presentismoPercentage);
        } else {
            resetForm();
            if (empleadoId) {
                setSelectedEmpleadoId(empleadoId);
            }
        }
    }, [liquidacionToEdit, empleadoId, resetForm]);
    const addRemunerativeItem = () => {
        setRowsRemunerative([
            ...rowsRemunerative,
            {
                id: Date.now().toString(),
                name: "",
                percentage: "",
                amount: "",
                checked: false,
            },
        ]);
    };

    const addNonRemunerativeItem = () => {
        const newItemId = Date.now();
        const years = calculateYearsOfService();
        const newItems: NonRemunerativeItem[] = [
            // Item principal
            {
                id: newItemId.toString(),
                name: "",
                percentage: "",
                amount: "",
                checked: false,
                isRemunerative: false,
            },
            // Fila de Antigüedad
            {
                id: (newItemId + 2).toString(),
                name: `Antigüedad 1% - ${years} años`,
                percentage: "1", // Siempre es 1% (el multiplicador por años se aplica en el cálculo)
                amount: "",
                checked: true,
                isSeniorityRow: true,
                referenceItemId: newItemId.toString(),
                isRemunerative: false,
            },
            // Fila de Presentismo
            {
                id: (newItemId + 1).toString(),
                name: "Presentismo",
                percentage: presentismoPercentage,
                amount: "",
                checked: true,
                isAttendanceRow: true,
                referenceItemId: newItemId.toString(),
                isRemunerative: false,
            },
        ];
        setRowsNonRemunerative([...rowsNonRemunerative, ...newItems]);
    };

    const addDeductionItem = () => {
        setDeductionItems([
            ...deductionItems,
            {
                id: Date.now().toString(),
                name: "",
                percentage: "",
                amount: "",
                checked: false,
                checkedRemunerative: false,
                checkedNonRemunerative: false,
                remunerativeAmount: "",
                nonRemunerativeAmount: "",
            },
        ]);
    };

    const removeRemunerativeItem = (id: number) => {
        setRowsRemunerative(rowsRemunerative.filter((row) => row.id !== id.toString()));
    };

    const removeNonRemunerativeItem = (id: number) => {
        // Eliminar el item principal y sus filas relacionadas
        setRowsNonRemunerative(
            rowsNonRemunerative.filter(
                (row) => row.id !== id.toString() && row.referenceItemId !== id.toString()
            )
        );
    };

    const removeDeductionItem = (id: number) => {
        setDeductionItems(deductionItems.filter((item) => item.id !== id.toString()));
    };

    const handleBasicSalaryChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value
            .replace(/[^0-9,]/g, "")
            .replace(/,(?=.*,)/g, "");
        setBasicSalary(value);
    };

    const handlePercentageChange = (id: number, value: string) => {
        value = value.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");
        setRowsRemunerative(
            rowsRemunerative.map((row) =>
                row.id === id.toString()
                    ? {
                        ...row,
                        percentage: value,
                        amount: row.checked
                            ? calculateAmount(value, basicSalary)
                            : row.amount,
                    }
                    : row
            )
        );
    };

    const handleNonRemunerativePercentageChange = (
        id: number,
        value: string
    ) => {
        value = value.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");
        setRowsNonRemunerative(
            rowsNonRemunerative.map((row) => {
                if (row.id === id.toString()) {
                    const referenceItem = row.referenceItemId
                        ? rowsNonRemunerative.find(
                            (r) => r.id === row.referenceItemId
                        )
                        : null;
                    return {
                        ...row,
                        percentage: value,
                        amount: referenceItem
                            ? calculateAmount(value, referenceItem.amount)
                            : row.amount,
                    };
                }
                return row;
            })
        );
    };

    const handleAmountChange = (id: number, value: string) => {
        value = value.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");
        setRowsRemunerative(
            rowsRemunerative.map((row) =>
                row.id === id.toString() ? { ...row, amount: value } : row
            )
        );
    };

    const handleNonRemunerativeAmountChange = (id: number, value: string) => {
        value = value.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");

        // Primera pasada: calcular el monto de antigüedad
        const tempRows = rowsNonRemunerative.map((row) => {
            if (row.id === id.toString()) {
                return { ...row, amount: value };
            }

            if (row.referenceItemId === id.toString() && row.isSeniorityRow) {
                const years = calculateYearsOfService();
                const baseAmount =
                    Number.parseFloat(
                        value.replace(/\./g, "").replace(",", ".")
                    ) || 0;
                const amount = (baseAmount * 0.01 * years).toFixed(2);
                return {
                    ...row,
                    amount: formatNumber(amount.replace(".", ",")),
                    percentage: years.toString(),
                };
            }

            return row;
        });

        // Segunda pasada: calcular el monto de attendance con el seniority actualizado
        const updatedItems = tempRows.map((row) => {
            if (row.referenceItemId === id.toString() && row.isAttendanceRow) {
                const baseAmount =
                    Number.parseFloat(
                        value.replace(/\./g, "").replace(",", ".")
                    ) || 0;

                // Buscar el seniority actualizado en tempRows en lugar del estado original
                const seniorityRow = tempRows.find(
                    (r) => r.referenceItemId === id.toString() && r.isSeniorityRow
                );

                const seniorityAmount = seniorityRow?.amount
                    ? Number.parseFloat(
                        seniorityRow.amount
                            .replace(/\./g, "")
                            .replace(",", ".")
                    ) || 0
                    : 0;

                const total = baseAmount + seniorityAmount;

                // Asegurar que el porcentaje esté en decimal
                const percentage =
                    Number.parseFloat(
                        row.percentage.replace(/\./g, "").replace(",", ".")
                    ) / 100;

                const amount = (total * percentage).toFixed(2);

                return {
                    ...row,
                    amount: formatNumber(amount.replace(".", ",")),
                };
            }

            return row;
        });

        setRowsNonRemunerative(updatedItems);
    };

    const handleCheckboxChange = (id: number, checked: boolean) => {
        setRowsRemunerative(
            rowsRemunerative.map((row) =>
                row.id === id.toString()
                    ? {
                        ...row,
                        checked,
                        amount: checked
                            ? calculateAmount(row.percentage, basicSalary)
                            : row.amount,
                    }
                    : row
            )
        );
    };

    const calculateAmount = (
        percentage: string,
        baseAmount: string,
        isAttendance?: boolean
    ) => {
        if (!baseAmount || !percentage) return "";

        // Convertir valores a números removiendo separadores
        const base = Number.parseFloat(
            baseAmount.replace(/\./g, "").replace(",", ".")
        );
        const percent = Number.parseFloat(
            percentage.replace(/\./g, "").replace(",", ".")
        );

        if (isNaN(base) || isNaN(percent)) return "";

        // Si es presentismo, calcular sobre la suma de sueldo básico + antigüedad
        if (isAttendance) {
            const basicSalaryNum =
                Number.parseFloat(
                    basicSalary.replace(/\./g, "").replace(",", ".")
                ) || 0;
            const seniorityNum =
                Number.parseFloat(
                    calculateSeniorityAmount()
                        .replace(/\./g, "")
                        .replace(",", ".")
                ) || 0;
            const total = basicSalaryNum + seniorityNum;
            const result = (total * (percent / 100)).toFixed(2);
            return formatNumber(result.replace(".", ","));
        }

        // Cálculo normal para otros casos
        const result = (base * (percent / 100)).toFixed(2);
        return formatNumber(result.replace(".", ","));
    };

    const calculateYearsOfService = () => {
        if (!empleadoSeleccionado?.fechaIngreso) return 0;
        const start = new Date(empleadoSeleccionado.fechaIngreso);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - start.getTime());
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        return diffYears;
    };

    const calculateSeniorityAmount = () => {
        if (!basicSalary || !empleadoSeleccionado?.fechaIngreso) return "";

        const salary = Number.parseFloat(
            basicSalary.replace(/\./g, "").replace(",", ".")
        );
        const years = calculateYearsOfService();

        if (isNaN(salary) || years === 0) return "";

        const amount = salary * 0.01 * years;
        return formatNumber(amount.toFixed(2).replace(".", ","));
    };

    const handleAmountBlur = (id: number, value: string) => {
        const formattedValue = formatNumber(value);
        setRowsRemunerative(
            rowsRemunerative.map((row) =>
                row.id === id.toString() ? { ...row, amount: formattedValue } : row
            )
        );
    };

    const handleNonRemunerativeAmountBlur = (id: number, value: string) => {
        const formattedValue = formatNumber(value);
        setRowsNonRemunerative(
            rowsNonRemunerative.map((row) =>
                row.id === id.toString() ? { ...row, amount: formattedValue } : row
            )
        );
    };

    const calculateTotalRemunerative = () => {
        const formatToNumber = (value: string) =>
            Number.parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;

        const salary = formatToNumber(basicSalary);
        const seniorityAmount = formatToNumber(calculateSeniorityAmount());
        const attendanceAmount = formatToNumber(
            calculateAmount(presentismoPercentage, basicSalary, true)
        );
        const totalRemunerative = rowsRemunerative.reduce((total, row) => {
            return total + formatToNumber(row.amount);
        }, 0);

        return (salary + seniorityAmount + attendanceAmount + totalRemunerative)
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const calculateTotalNonRemunerative = () => {
        const formatToNumber = (value: string) =>
            Number.parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;

        const total = rowsNonRemunerative.reduce((total, row) => {
            return total + formatToNumber(row.amount);
        }, 0);

        return total
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const calculateDeductionTotals = () => {
        const formatToNumber = (value: string) =>
            Number.parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;

        const totalRemunerative = deductionItems.reduce((total, item) => {
            if (item.checkedRemunerative) {
                const baseAmount = formatToNumber(calculateTotalRemunerative());
                const percentage = formatToNumber(item.percentage);
                return total + (baseAmount * percentage) / 100;
            }
            return total + formatToNumber(item.remunerativeAmount);
        }, 0);

        const totalNonRemunerative = deductionItems.reduce((total, item) => {
            if (item.checkedNonRemunerative) {
                const baseAmount = formatToNumber(
                    calculateTotalNonRemunerative()
                );
                const percentage = formatToNumber(item.percentage);
                return total + (baseAmount * percentage) / 100;
            }
            return total + formatToNumber(item.nonRemunerativeAmount);
        }, 0);

        const formatTotal = (value: number) =>
            value
                .toFixed(2)
                .replace(".", ",")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return {
            remunerative: formatTotal(totalRemunerative),
            nonRemunerative: formatTotal(totalNonRemunerative),
            total: formatTotal(totalRemunerative + totalNonRemunerative),
        };
    };

    const calculateTotalNeto = () => {
        const formatToNumber = (value: string) =>
            Number.parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;

        const totalBruto =
            formatToNumber(calculateTotalRemunerative()) +
            formatToNumber(calculateTotalNonRemunerative());
        const totalDeducciones = formatToNumber(
            calculateDeductionTotals().total
        );

        return formatNumber(
            (totalBruto - totalDeducciones).toFixed(2).replace(".", ",")
        );
    };

    const handleSubmit = () => {
        if (!selectedEmpleadoId) {
            toast.error("Error", {
                description: "Debe seleccionar un empleado.",
            });
            return;
        }

        if (!periodo) {
            toast.error("Error", {
                description: "Debe ingresar un período.",
            });
            return;
        }

        if (!fecha) {
            toast.error("Error", {
                description: "Debe ingresar una fecha.",
            });
            return;
        }

        if (!basicSalary) {
            toast.error("Error", {
                description: "Debe ingresar un sueldo básico.",
            });
            return;
        }

        setIsSubmitting(true);

        const liquidacionData = {
            empleadoId: selectedEmpleadoId,
            fecha,
            periodo,
            basicSalary,

            presentismoPercentage,
            rowsRemunerative,
            rowsNonRemunerative,
            deductionItems,
            totalRemunerativo: calculateTotalRemunerative(),
            totalNoRemunerativo: calculateTotalNonRemunerative(),
            totalDeducciones: calculateDeductionTotals().total,
            totalNeto: calculateTotalNeto(),
        };

        if (liquidacionToEdit) {
            updateLiquidacion({
                ...liquidacionData,
                startDate: liquidacionToEdit.startDate, // Preserve the required startDate field from original liquidacion
                id: liquidacionToEdit.id,
            });
        } else {
            addLiquidacion({
                ...liquidacionData,
                id: Date.now().toString(), // Generate a unique ID
                startDate: new Date().toISOString(), // Set current date as startDate
            });
        }

        setIsSubmitting(false);
        resetForm();
        onSubmitSuccess();
    };

    // Obtener el empleado seleccionado
    const empleadoSeleccionado = empleados.find(
        (e) => e.id === selectedEmpleadoId
    );

    return (
        <div className="space-y-6">
            {selectedEmpleadoId && (
                <LiquidacionHeader empleadoId={selectedEmpleadoId} />
            )}
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Input
                        id="periodo"
                        placeholder="Ej: Enero 2023"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de liquidación</Label>
                    <Input
                        id="fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </div>
            </div>

            {/* Sección Remunerativa */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">Remunerativo</h2>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={addRemunerativeItem}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">
                                Concepto
                            </TableHead>
                            <TableHead className="w-[150px] text-right">Importe</TableHead>
                            <TableHead className="text-center w-[150px]">
                                Aplica %
                            </TableHead>
                            <TableHead className="w-[150px] text-right">Valor %</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        <TableRow>
                            <TableCell>Sueldo básico</TableCell>
                            <TableCell>
                                <Input
                                    value={basicSalary}
                                    onChange={handleBasicSalaryChange}
                                    onBlur={(e) =>
                                        setBasicSalary(
                                            formatNumber(e.target.value)
                                        )
                                    }
                                    className="text-end"
                                />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>

                        <TableRow className="bg-muted/50">
                            <TableCell>
                                Antigüedad 1% - {calculateYearsOfService()} años
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={calculateSeniorityAmount()}
                                    readOnly
                                    className="text-end bg-muted/50"
                                />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {calculateYearsOfService()
                                    ? `${calculateYearsOfService()} año(s) * 1%`
                                    : ""}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                            <TableCell>Presentismo</TableCell>
                            <TableCell>
                                <Input
                                    value={calculateAmount(
                                        presentismoPercentage,
                                        basicSalary,
                                        true
                                    )}
                                    readOnly
                                    className="text-end bg-muted/50"
                                />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-muted-foreground">
                                <Input
                                    value={presentismoPercentage}
                                    onChange={(e) =>
                                        setPresentismoPercentage(
                                            e.target.value
                                                .replace(/[^0-9,]/g, "")
                                                .replace(/,(?=.*,)/g, "")
                                        )
                                    }
                                    onBlur={(e) =>
                                        setPresentismoPercentage(
                                            formatNumber(e.target.value)
                                        )
                                    }
                                    className="text-end"
                                />
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {rowsRemunerative.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Input
                                        value={row.name}
                                        onChange={(e) =>
                                            setRowsRemunerative(
                                                rowsRemunerative.map((r) =>
                                                    r.id === row.id
                                                        ? {
                                                            ...r,
                                                            name: e.target
                                                                .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={row.amount}
                                        onChange={(e) =>
                                            !row.checked &&
                                            handleAmountChange(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        readOnly={row.checked}
                                        onBlur={(e) =>
                                            handleAmountBlur(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        className="text-end"
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox
                                        checked={row.checked}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                Number(row.id),
                                                checked as boolean
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={row.percentage}
                                        className="text-end"
                                        onChange={(e) =>
                                            handlePercentageChange(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        disabled={!row.checked}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeRemunerativeItem(Number(row.id))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="font-semibold text-base">
                            <TableCell>Total remunerativo</TableCell>
                            <TableCell className="text-end">
                                {calculateTotalRemunerative()}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            {/* Sección No Remunerativa */}
            <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">No Remunerativo</h2>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={addNonRemunerativeItem}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">
                                Concepto
                            </TableHead>
                            <TableHead className="w-[150px] text-right">Importe</TableHead>
                            <TableHead className="w-[150px] text-right">Valor %</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rowsNonRemunerative.map((row) => (
                            <TableRow
                                key={row.id}
                                className={
                                    row.isAttendanceRow || row.isSeniorityRow
                                        ? "bg-muted/50"
                                        : ""
                                }
                            >
                                <TableCell>
                                    <Input
                                        value={
                                            row.isSeniorityRow
                                                ? `Antigüedad 1% - ${calculateYearsOfService()} años`
                                                : row.name
                                        }
                                        onChange={(e) =>
                                            setRowsNonRemunerative(
                                                rowsNonRemunerative.map((r) =>
                                                    r.id === row.id
                                                        ? {
                                                            ...r,
                                                            name: e.target
                                                                .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        readOnly={
                                            row.isAttendanceRow ||
                                            row.isSeniorityRow
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={row.amount}
                                        onChange={(e) =>
                                            handleNonRemunerativeAmountChange(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        onBlur={(e) =>
                                            handleNonRemunerativeAmountBlur(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        readOnly={
                                            row.isAttendanceRow ||
                                            row.isSeniorityRow
                                        }
                                        className="text-end"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={row.percentage}
                                        className="text-right"
                                        onChange={(e) =>
                                            handleNonRemunerativePercentageChange(
                                                Number(row.id),
                                                e.target.value
                                            )
                                        }
                                        readOnly={
                                            !row.isAttendanceRow &&
                                            !row.isSeniorityRow
                                        }
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    {!row.isAttendanceRow &&
                                        !row.isSeniorityRow && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeNonRemunerativeItem(
                                                        Number(row.id)
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="font-semibold text-base">
                            <TableCell>Total no remunerativo</TableCell>
                            <TableCell className="text-end">
                                {calculateTotalNonRemunerative()}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            {/* Sección Deducciones */}
            <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">Deducciones</h2>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={addDeductionItem}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">Concepto</TableHead>
                            <TableHead className="text-right w-[150px]">Remunerativo</TableHead>
                            <TableHead className="text-right w-[150px]">No remunerativo</TableHead>
                            <TableHead className="text-center w-[150px]">Aplica %</TableHead>
                            <TableHead className="text-right w-[150px]">Valor %</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deductionItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Input
                                        value={item.name}
                                        onChange={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            name: e.target
                                                                .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={
                                            item.checkedRemunerative
                                                ? formatNumber(
                                                    (
                                                        (Number.parseFloat(
                                                            calculateTotalRemunerative()
                                                                .replace(
                                                                    /\./g,
                                                                    ""
                                                                )
                                                                .replace(
                                                                    ",",
                                                                    "."
                                                                )
                                                          ) *
                                                            Number.parseFloat(
                                                                item.percentage
                                                                    .replace(
                                                                        /\./g,
                                                                        ""
                                                                    )
                                                                    .replace(
                                                                        ",",
                                                                        "."
                                                                    )
                                                            )) /
                                                        100
                                                    )
                                                        .toFixed(2)
                                                        .replace(".", ",")
                                                )
                                                : item.remunerativeAmount
                                        }
                                        onChange={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            remunerativeAmount:
                                                                e.target
                                                                    .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        onBlur={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            remunerativeAmount:
                                                                formatNumber(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        readOnly={item.checkedRemunerative}
                                        className="text-end"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={
                                            item.checkedNonRemunerative
                                                ? formatNumber(
                                                    (
                                                        (Number.parseFloat(
                                                            calculateTotalNonRemunerative()
                                                                .replace(
                                                                    /\./g,
                                                                    ""
                                                                )
                                                                .replace(
                                                                    ",",
                                                                    "."
                                                                )
                                                          ) *
                                                            Number.parseFloat(
                                                                item.percentage
                                                                    .replace(
                                                                        /\./g,
                                                                        ""
                                                                    )
                                                                    .replace(
                                                                        ",",
                                                                        "."
                                                                    )
                                                            )) /
                                                        100
                                                    )
                                                        .toFixed(2)
                                                        .replace(".", ",")
                                                )
                                                : item.nonRemunerativeAmount
                                        }
                                        onChange={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            nonRemunerativeAmount:
                                                                e.target
                                                                    .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        onBlur={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            nonRemunerativeAmount:
                                                                formatNumber(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        readOnly={item.checkedNonRemunerative}
                                        className="text-end"
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">R</span>
                                            <Checkbox
                                                checked={
                                                    item.checkedRemunerative
                                                }
                                                onCheckedChange={(checked) =>
                                                    setDeductionItems(
                                                        deductionItems.map(
                                                            (r) =>
                                                                r.id === item.id
                                                                    ? {
                                                                        ...r,
                                                                        checkedRemunerative:
                                                                            checked as boolean,
                                                                    }
                                                                    : r
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">NR</span>
                                            <Checkbox
                                                checked={
                                                    item.checkedNonRemunerative
                                                }
                                                onCheckedChange={(checked) =>
                                                    setDeductionItems(
                                                        deductionItems.map(
                                                            (r) =>
                                                                r.id === item.id
                                                                    ? {
                                                                        ...r,
                                                                        checkedNonRemunerative:
                                                                            checked as boolean,
                                                                    }
                                                                    : r
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={item.percentage}
                                        className="text-right"
                                        onChange={(e) =>
                                            setDeductionItems(
                                                deductionItems.map((r) =>
                                                    r.id === item.id
                                                        ? {
                                                            ...r,
                                                            percentage:
                                                                e.target
                                                                    .value,
                                                        }
                                                        : r
                                                )
                                            )
                                        }
                                        disabled={
                                            !item.checkedRemunerative &&
                                            !item.checkedNonRemunerative
                                        }
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeDeductionItem(Number(item.id))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Subtotal Remunerativo</TableCell>
                            <TableCell className="text-end" colSpan={5}>
                                {calculateDeductionTotals().remunerative}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Subtotal No Remunerativo</TableCell>
                            <TableCell className="text-end" colSpan={5}>
                                {calculateDeductionTotals().nonRemunerative}
                            </TableCell>
                        </TableRow>
                        <TableRow className="font-bold text-base">
                            <TableCell>Total Deducciones</TableCell>
                            <TableCell className="text-end" colSpan={5}>
                                {calculateDeductionTotals().total}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            {/* Footer con Total Neto */}
            <div className="mt-8 p-6 bg-primary/10 rounded-lg border-2 border-primary space-y-6">
                {/* Detalle Remunerativo */}
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Detalle Remunerativo</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span>Sueldo básico</span>
                            <span>{basicSalary}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Antigüedad ({calculateYearsOfService()} años)</span>
                            <span>{calculateSeniorityAmount()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Presentismo ({presentismoPercentage}%)</span>
                            <span>{calculateAmount(presentismoPercentage, basicSalary, true)}</span>
                        </div>
                        {rowsRemunerative.map((row) => (
                            <div key={row.id} className="flex justify-between items-center">
                                <span>{row.name} {row.checked && `(${row.percentage}%)`}</span>
                                <span>{row.amount}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center font-bold pt-2 border-t">
                            <span>Total Remunerativo</span>
                            <span>{calculateTotalRemunerative()}</span>
                        </div>
                    </div>
                </div>

                {/* Detalle No Remunerativo */}
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Detalle No Remunerativo</h3>
                    <div className="space-y-1">
                        {rowsNonRemunerative.map((row) => (
                            <div key={row.id} className="flex justify-between items-center">
                                <span>{row.name} {(row.isAttendanceRow || row.isSeniorityRow) && `(${row.percentage}%)`}</span>
                                <span>{row.amount}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center font-bold pt-2 border-t">
                            <span>Total No Remunerativo</span>
                            <span>{calculateTotalNonRemunerative()}</span>
                        </div>
                    </div>
                </div>

                {/* Detalle Deducciones */}
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Detalle Deducciones</h3>
                    <div className="space-y-1">
                        {deductionItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span>{item.name} {(item.checkedRemunerative || item.checkedNonRemunerative) && `(${item.percentage}%)`}</span>
                                <span className="text-destructive">
                                    -{item.checkedRemunerative ? 
                                        formatNumber((Number.parseFloat(calculateTotalRemunerative().replace(/\./g, "").replace(",", ".")) * Number.parseFloat(item.percentage.replace(/\./g, "").replace(",", ".")) / 100).toFixed(2).replace(".", ",")) : 
                                        item.remunerativeAmount}
                                    {item.checkedNonRemunerative && " / -"}
                                    {item.checkedNonRemunerative ? 
                                        formatNumber((Number.parseFloat(calculateTotalNonRemunerative().replace(/\./g, "").replace(",", ".")) * Number.parseFloat(item.percentage.replace(/\./g, "").replace(",", ".")) / 100).toFixed(2).replace(".", ",")) : 
                                        item.nonRemunerativeAmount}
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center font-bold pt-2 border-t text-destructive">
                            <span>Total Deducciones</span>
                            <span>-{calculateDeductionTotals().total}</span>
                        </div>
                    </div>
                </div>

                {/* Totales Finales */}
                <div className="space-y-4 pt-4 border-t-2">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total Sueldo Bruto</span>
                        <span>
                            {formatNumber(
                                (
                                    Number.parseFloat(
                                        calculateTotalRemunerative()
                                            .replace(/\./g, "")
                                            .replace(",", ".")
                                    ) +
                                    Number.parseFloat(
                                        calculateTotalNonRemunerative()
                                            .replace(/\./g, "")
                                            .replace(",", ".")
                                    )
                                )
                                    .toFixed(2)
                                    .replace(".", ",")
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold text-primary">
                        <span>Total Sueldo Neto</span>
                        <span>{calculateTotalNeto()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                >
                    {isSubmitting
                        ? "Guardando..."
                        : liquidacionToEdit
                        ? "Actualizar Liquidación"
                        : "Guardar Liquidación"}
                </Button>
            </div>
        </div>
    );
}
