"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";
import { usePersonas } from "./PersonasContext";
import { toast } from "sonner";

export interface SalaryItem {
    id: string;
    name: string;
    percentage: string;
    amount: string;
    checked: boolean;
    isAttendanceRow?: boolean;
    isSeniorityRow?: boolean;
    referenceItemId?: string;
}

export interface NonRemunerativeItem extends SalaryItem {
    isRemunerative: false;
}

export interface DeductionItem extends SalaryItem {
    checkedRemunerative: boolean;
    checkedNonRemunerative: boolean;
    remunerativeAmount: string;
    nonRemunerativeAmount: string;
}

export interface Liquidacion {
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
}

interface LiquidacionesContextType {
    liquidaciones: Liquidacion[];
    setLiquidaciones: (liquidaciones: Liquidacion[]) => void;
    addLiquidacion: (liquidacion: Liquidacion) => void;
    updateLiquidacion: (liquidacion: Liquidacion) => void;
    deleteLiquidacion: (id: string) => void;
    getLiquidacionesByEmpleado: (empleadoId: string) => Liquidacion[];
}

export const LiquidacionesContext = createContext<LiquidacionesContextType>({
    liquidaciones: [],
    setLiquidaciones: () => {},
    addLiquidacion: () => {},
    updateLiquidacion: () => {},
    deleteLiquidacion: () => {},
    getLiquidacionesByEmpleado: () => [],
});

// Deducciones por defecto según la memoria del sistema
export const defaultDeductions: DeductionItem[] = [
    {
        id: "1",
        name: "Jubilación",
        percentage: "11",
        amount: "",
        checked: false,
        checkedRemunerative: true,
        checkedNonRemunerative: false,
        remunerativeAmount: "",
        nonRemunerativeAmount: "",
    },
    {
        id: "2",
        name: "INSSJP",
        percentage: "3",
        amount: "",
        checked: false,
        checkedRemunerative: true,
        checkedNonRemunerative: false,
        remunerativeAmount: "",
        nonRemunerativeAmount: "",
    },
    {
        id: "3",
        name: "Aporte Sindical",
        percentage: "2",
        amount: "",
        checked: false,
        checkedRemunerative: true,
        checkedNonRemunerative: true,
        remunerativeAmount: "",
        nonRemunerativeAmount: "",
    },
    {
        id: "4",
        name: "Obra Social",
        percentage: "6",
        amount: "",
        checked: false,
        checkedRemunerative: true,
        checkedNonRemunerative: true,
        remunerativeAmount: "",
        nonRemunerativeAmount: "",
    },
];

export const LiquidacionesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [liquidaciones, setLiquidacionesState] = useState<Liquidacion[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('liquidaciones');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const { } = usePersonas();

    const setLiquidaciones = (newLiquidaciones: Liquidacion[]) => {
        setLiquidacionesState(newLiquidaciones);
        localStorage.setItem('liquidaciones', JSON.stringify(newLiquidaciones));
    };

    const addLiquidacion = (liquidacion: Liquidacion) => {
        // Asegurarse de que la liquidación tenga las deducciones por defecto
        const newLiquidacion = {
            ...liquidacion,
            deductionItems: liquidacion.deductionItems.length > 0
                ? liquidacion.deductionItems
                : defaultDeductions,
        };
        const newLiquidaciones = [...liquidaciones, newLiquidacion];
        setLiquidaciones(newLiquidaciones);
        toast.success("Liquidación guardada", {
            description: "La liquidación se ha guardado correctamente.",
        });
    };

    const updateLiquidacion = (liquidacion: Liquidacion) => {
        const newLiquidaciones = liquidaciones.map((l) => 
            l.id === liquidacion.id ? liquidacion : l
        );
        setLiquidaciones(newLiquidaciones);
        toast.success("Liquidación actualizada", {
            description: "La liquidación se ha actualizado correctamente.",
        });
    };

    const deleteLiquidacion = (id: string) => {
        const newLiquidaciones = liquidaciones.filter((l) => l.id !== id);
        setLiquidaciones(newLiquidaciones);
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
                setLiquidaciones,
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
    if (!context) {
        throw new Error(
            "useLiquidaciones must be used within a LiquidacionesProvider"
        );
    }
    return context;
};
