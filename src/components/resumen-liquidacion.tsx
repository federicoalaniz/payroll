import { formatNumber } from "@/lib/utils";

interface ResumenLiquidacionProps {
    basicSalary: string;
    calculateYearsOfService: () => number;
    calculateSeniorityAmount: () => string;
    presentismoPercentage: string;
    calculateAmount: (percentage: string, base: string, isRemunerative: boolean) => string;
    rowsRemunerative: Array<{
        id: string;
        name: string;
        checked: boolean;
        percentage: string;
        amount: string;
    }>;
    rowsNonRemunerative: Array<{
        id: string;
        name: string;
        isAttendanceRow: boolean;
        isSeniorityRow: boolean;
        percentage: string;
        amount: string;
    }>;
    deductionItems: Array<{
        id: string;
        name: string;
        checkedRemunerative: boolean;
        checkedNonRemunerative: boolean;
        percentage: string;
    }>;
    calculateTotalRemunerative: () => string;
    calculateTotalNonRemunerative: () => string;
    calculateDeductionTotals: () => {
        remunerative: string;
        nonRemunerative: string;
    };
    calculateTotalNeto: () => string;
}

export function ResumenLiquidacion({
    basicSalary,
    calculateYearsOfService,
    calculateSeniorityAmount,
    presentismoPercentage,
    calculateAmount,
    rowsRemunerative,
    rowsNonRemunerative,
    deductionItems,
    calculateTotalRemunerative,
    calculateTotalNonRemunerative,
    calculateDeductionTotals,
    calculateTotalNeto,
}: ResumenLiquidacionProps) {
    return (
        <div className=" p-6 rounded-lg border-2 border-gray-500 space-y-6">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-500">
                            <th rowSpan={2} className="text-left py-2 ">
                                Concepto
                            </th>
                            <th
                                colSpan={2}
                                className="text-center py-2 border-r-2 border-primary"
                            >
                                Haberes
                            </th>
                            <th colSpan={2} className="text-center py-2">
                                Deducciones
                            </th>
                        </tr>
                        <tr className="border-b-2 border-primary">
                            <th className="text-right py-2 px-4 w-[220px]">
                                Remunerativo
                            </th>
                            <th className="text-right py-2 px-4 w-[220px] border-r-2 border-primary">
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
                                {formatNumber(basicSalary)}
                            </td>
                            <td className="text-right px-4 border-r-2 border-primary">
                                -
                            </td>
                            <td className="text-right px-4">-</td>
                            <td className="text-right px-4">-</td>
                        </tr>
                        <tr>
                            <td className="py-2">
                                Antigüedad ({calculateYearsOfService()}{" "}
                                años)
                            </td>
                            <td className="text-right px-4">
                                {formatNumber(calculateSeniorityAmount())}
                            </td>
                            <td className="text-right px-4 border-r-2 border-primary">
                                -
                            </td>
                            <td className="text-right px-4">-</td>
                            <td className="text-right px-4">-</td>
                        </tr>
                        <tr>
                            <td className="py-2">
                                Presentismo ({presentismoPercentage}%)
                            </td>
                            <td className="text-right px-4">
                                {formatNumber(calculateAmount(
                                    presentismoPercentage,
                                    basicSalary,
                                    true
                                ))}
                            </td>
                            <td className="text-right px-4 border-r-2 border-primary">
                                -
                            </td>
                            <td className="text-right px-4">-</td>
                            <td className="text-right px-4">-</td>
                        </tr>
                        {rowsRemunerative.map((row) => (
                            <tr key={row.id}>
                                <td className="py-2">
                                    {row.name}{" "}
                                    {row.checked && `(${row.percentage}%)`}
                                </td>
                                <td className="text-right px-4">
                                    {formatNumber(row.amount)}
                                </td>
                                <td className="text-right px-4 border-r-2 border-primary">
                                    -
                                </td>
                                <td className="text-right px-4">-</td>
                                <td className="text-right px-4">-</td>
                            </tr>
                        ))}
                        {rowsNonRemunerative.map((row) => (
                            <tr key={row.id}>
                                <td className="py-2">
                                    {row.name}{" "}
                                    {(row.isAttendanceRow ||
                                        row.isSeniorityRow) &&
                                        `(${row.percentage}%)`}
                                </td>
                                <td className="text-right px-4">-</td>
                                <td className="text-right px-4 border-r-2 border-primary">
                                    {formatNumber(row.amount)}
                                </td>
                                <td className="text-right px-4">-</td>
                                <td className="text-right px-4">-</td>
                            </tr>
                        ))}
                        {deductionItems.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2">
                                    {item.name}{" "}
                                    {(item.checkedRemunerative ||
                                        item.checkedNonRemunerative) &&
                                        `(${item.percentage}%)`}
                                </td>
                                <td className="text-right px-4">-</td>
                                <td className="text-right px-4 border-r-2 border-primary">
                                    -
                                </td>
                                <td className="text-right px-4">
                                    {item.checkedRemunerative
                                        ? `${formatNumber(
                                            (
                                                (Number.parseFloat(
                                                    calculateTotalRemunerative()
                                                        .replace(/\./g, "")
                                                        .replace(",", ".")
                                                ) *
                                                    Number.parseFloat(
                                                        item.percentage
                                                            .replace(/\./g, "")
                                                            .replace(",", ".")
                                                    )) /
                                                100
                                            )
                                                .toFixed(2)
                                                .replace(".", ",")
                                        )}`
                                        : `-`}
                                </td>
                                <td className="text-right px-4">
                                    {item.checkedNonRemunerative
                                        ? `${formatNumber(
                                            (
                                                (Number.parseFloat(
                                                    calculateTotalNonRemunerative()
                                                        .replace(/\./g, "")
                                                        .replace(",", ".")
                                                ) *
                                                    Number.parseFloat(
                                                        item.percentage
                                                            .replace(/\./g, "")
                                                            .replace(",", ".")
                                                    )) /
                                                100
                                            )
                                                .toFixed(2)
                                                .replace(".", ",")
                                        )}`
                                        : `-`}
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-primary font-bold">
                            <td className="py-2">Subtotales</td>
                            <td className="text-right px-4">
                                {formatNumber(calculateTotalRemunerative())}
                            </td>
                            <td className="text-right px-4 border-r-2 border-primary">
                                {formatNumber(calculateTotalNonRemunerative())}
                            </td>
                            <td className="text-right px-4">
                                {formatNumber(calculateDeductionTotals().remunerative)}
                            </td>
                            <td className="text-right px-4">
                                {formatNumber(calculateDeductionTotals().nonRemunerative)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totales Finales */}
            <div className="space-y-4 pt-4 border-t-2">
                <div className="flex justify-between items-center font-semibold text-muted-foreground">
                    <span>Sueldo Bruto</span>
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
                <div className="flex justify-between items-center font-semibold text-muted-foreground">
                    <span>Deducciones</span>
                    <span>
                        {formatNumber(
                            (
                                Number.parseFloat(
                                    calculateDeductionTotals()
                                        .remunerative.replace(/\./g, "")
                                        .replace(",", ".")
                                ) +
                                Number.parseFloat(
                                    calculateDeductionTotals()
                                        .nonRemunerative.replace(/\./g, "")
                                        .replace(",", ".")
                                )
                            )
                                .toFixed(2)
                                .replace(".", ",")
                        )}
                    </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>SUELDO NETO</span>
                    <span>{formatNumber(calculateTotalNeto())}</span>
                </div>
            </div>
        </div>
    );
}