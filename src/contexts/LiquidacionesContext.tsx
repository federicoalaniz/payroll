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
    showAttendance?: boolean;
    showSeniority?: boolean;
}

export interface NonRemunerativeItem extends SalaryItem {
    isRemunerative: false;
    showSeniority?: boolean;
    showAttendance?: boolean;
}

export interface DeductionItem extends SalaryItem {
    checkedRemunerative: boolean;
    checkedNonRemunerative: boolean;
    remunerativeAmount: string;
    nonRemunerativeAmount: string;
}

export interface PeriodoLiquidacion {
    month: number;
    year: number;
    type: 'monthly' | 'quincena1' | 'quincena2';
}

export interface Liquidacion {
    id: string;
    empleadoId: string;
    fecha: string;
    periodo: string; // Mantener para compatibilidad con datos existentes
    periodoObj?: PeriodoLiquidacion; // Nuevo formato de periodo
    basicSalary: string;
    startDate: string;
    presentismoPercentage: string;
    rowsRemunerative: SalaryItem[];
    rowsNonRemunerative: NonRemunerativeItem[] | SalaryItem[];
    deductionItems: DeductionItem[];
    // Valores calculados
    antiguedadAmount: string;
    presentismoAmount: string;
    sueldoBruto: string;
    totalRemunerativo: string;
    totalNoRemunerativo: string;
    totalDeducciones: string;
    deduccionesRemunerativas: string;
    deduccionesNoRemunerativas: string;
    totalNeto: string;
}



interface LiquidacionesContextType {
    liquidaciones: Liquidacion[];
    setLiquidaciones: (liquidaciones: Liquidacion[]) => void;
    addLiquidacion: (liquidacion: Liquidacion) => void;
    updateLiquidacion: (liquidacion: Liquidacion) => void;
    deleteLiquidacion: (id: string) => void;
    getLiquidacionesByEmpleado: (empleadoId: string) => Liquidacion[];
    defaultDeductions: DeductionItem[];
}

export const LiquidacionesContext = createContext<LiquidacionesContextType>({
    liquidaciones: [],
    setLiquidaciones: () => {},
    addLiquidacion: () => {},
    updateLiquidacion: () => {},
    deleteLiquidacion: () => {},
    getLiquidacionesByEmpleado: () => [],
    defaultDeductions: [],
});

// Deducciones por defecto según la memoria del sistema
export const defaultDeductions: DeductionItem[] = [
    {
        id: "1",
        name: "Jubilación 11%",
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
        name: "I.N.S.S.J.P. 3%",
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
        name: "Aporte Sind. 2%",
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
        name: "Obra Social 6%",
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
    

    
    const { empleados } = usePersonas();

    const setLiquidaciones = (newLiquidaciones: Liquidacion[]) => {
        setLiquidacionesState(newLiquidaciones);
        localStorage.setItem('liquidaciones', JSON.stringify(newLiquidaciones));
    };
    


    const addLiquidacion = (liquidacion: Liquidacion) => {
        // Asegurarse de que la liquidación tenga las deducciones por defecto
        // Primero creamos una copia profunda de las deducciones por defecto para evitar modificar el original
        const defaultDeductionsCopy = JSON.parse(JSON.stringify(defaultDeductions));
        
        // Aseguramos que las deducciones por defecto estén siempre presentes
        let deductionItems = [];
        
        // Si hay deducciones existentes, las mantenemos pero nos aseguramos que las deducciones fijas estén presentes
        if (Array.isArray(liquidacion.deductionItems) && liquidacion.deductionItems.length > 0) {
            // Filtramos las deducciones que no son las fijas (las que no tienen IDs del 1 al 4)
            const customDeductions = liquidacion.deductionItems.filter(item => 
                !['1', '2', '3', '4'].includes(item.id)
            );
            
            // Combinamos las deducciones fijas con las personalizadas
            deductionItems = [...defaultDeductionsCopy, ...customDeductions];
        } else {
            deductionItems = defaultDeductionsCopy;
        }
        
        // Inicializamos la nueva liquidación con las deducciones
        const newLiquidacion = {
            ...liquidacion,
            deductionItems: deductionItems,
        };
        
        // Inicializamos arrays vacíos si no existen para evitar errores
        if (!newLiquidacion.rowsRemunerative) newLiquidacion.rowsRemunerative = [];
        if (!newLiquidacion.rowsNonRemunerative) newLiquidacion.rowsNonRemunerative = [];
        
        // Buscar el empleado para obtener su empresaId
        const empleado = empleados.find(e => e.id === liquidacion.empleadoId);
        
        // Asegurar que todos los items no remunerativos tengan isRemunerative: false
        if (empleado) {
            // Asegurar que todos los items no remunerativos tengan isRemunerative: false
            if (newLiquidacion.rowsNonRemunerative && newLiquidacion.rowsNonRemunerative.length > 0) {
                const existingItemsWithCorrectFlag = newLiquidacion.rowsNonRemunerative.map(item => ({ 
                    ...item, 
                    isRemunerative: false 
                }));
                
                newLiquidacion.rowsNonRemunerative = existingItemsWithCorrectFlag;
            }
        }
        
        const newLiquidaciones = [...liquidaciones, newLiquidacion];
        setLiquidaciones(newLiquidaciones);
        toast.success("Liquidación guardada", {
            description: "La liquidación se ha guardado correctamente.",
        });
    };

    const updateLiquidacion = (liquidacion: Liquidacion) => {
        // Aseguramos que las deducciones fijas estén presentes y con los valores correctos
        const defaultDeductionsCopy = JSON.parse(JSON.stringify(defaultDeductions));
        
        // Filtramos las deducciones que no son las fijas (las que no tienen IDs del 1 al 4)
        const customDeductions = liquidacion.deductionItems.filter(item => 
            !['1', '2', '3', '4'].includes(item.id)
        );
        
        // Combinamos las deducciones fijas con las personalizadas
        const updatedDeductionItems = [...defaultDeductionsCopy, ...customDeductions];
        
        // Actualizamos la liquidación con las deducciones actualizadas
        const updatedLiquidacion = {
            ...liquidacion,
            deductionItems: updatedDeductionItems,
        };
        
        const newLiquidaciones = liquidaciones.map((l) => 
            l.id === liquidacion.id ? updatedLiquidacion : l
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
                defaultDeductions,
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
