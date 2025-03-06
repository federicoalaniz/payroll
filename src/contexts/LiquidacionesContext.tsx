"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";
import { usePersonas } from "./PersonasContext";
import { toast } from "sonner";

export type SalaryItem = {
    id: number;
    name: string;
    percentage: string;
    amount: string;
    checked: boolean;
};

export type NonRemunerativeItem = SalaryItem & {
    isAttendanceRow?: boolean;
    isSeniorityRow?: boolean;
    referenceItemId?: number;
};

export type DeductionItem = SalaryItem & {
    remunerativeAmount: string;
    nonRemunerativeAmount: string;
    checkedRemunerative: boolean;
    checkedNonRemunerative: boolean;
};

export type Liquidacion = {
    id: string;
    empleadoId: string;
    fecha: string;
    periodo: string;
    basicSalary: string;
    startDate: string;
    presentismoPercentage: string;
    rowsRemunerative: SalaryItem[];
    rowsNonRemunerative: NonRemunerativeItem[];
    deductionItems: DeductionItem[];
    totalRemunerativo: string;
    totalNoRemunerativo: string;
    totalDeducciones: string;
    totalNeto: string;
};

type LiquidacionesContextType = {
    liquidaciones: Liquidacion[];
    addLiquidacion: (liquidacion: Omit<Liquidacion, "id">) => void;
    updateLiquidacion: (liquidacion: Liquidacion) => void;
    deleteLiquidacion: (id: string) => void;
    getLiquidacionesByEmpleado: (empleadoId: string) => Liquidacion[];
};

const LiquidacionesContext = createContext<
    LiquidacionesContextType | undefined
>(undefined);

export const LiquidacionesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
    const { empleados } = usePersonas();

    const addLiquidacion = (liquidacion: Omit<Liquidacion, "id">) => {
        const newLiquidacion = { ...liquidacion, id: Date.now().toString() };
        setLiquidaciones([...liquidaciones, newLiquidacion]);
        toast.success("Liquidación guardada", {
            description: "La liquidación se ha guardado correctamente.",
        });
    };

    const updateLiquidacion = (updatedLiquidacion: Liquidacion) => {
        setLiquidaciones(
            liquidaciones.map((liquidacion) =>
                liquidacion.id === updatedLiquidacion.id
                    ? updatedLiquidacion
                    : liquidacion
            )
        );
        toast.success("Liquidación actualizada", {
            description: "La liquidación se ha actualizado correctamente.",
        });
    };

    const deleteLiquidacion = (id: string) => {
        setLiquidaciones(
            liquidaciones.filter((liquidacion) => liquidacion.id !== id)
        );
        toast.success("Liquidación eliminada", {
            description: "La liquidación se ha eliminado correctamente.",
        });
    };

    const getLiquidacionesByEmpleado = (empleadoId: string) => {
        return liquidaciones.filter(
            (liquidacion) => liquidacion.empleadoId === empleadoId
        );
    };

    return (
        <LiquidacionesContext.Provider
            value={{
                liquidaciones,
                addLiquidacion,
                updateLiquidacion,
                deleteLiquidacion,
                getLiquidacionesByEmpleado,
            }}
        >
            {children}
        </LiquidacionesContext.Provider>
    );
};

export const useLiquidaciones = () => {
    const context = useContext(LiquidacionesContext);
    if (context === undefined) {
        throw new Error(
            "useLiquidaciones must be used within a LiquidacionesProvider"
        );
    }
    return context;
};
