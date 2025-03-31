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
    isPinned?: boolean;
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

// Interfaz para los items fijados por empresa
export interface PinnedItems {
    empresaId: string;
    remunerativeItems: SalaryItem[];
    nonRemunerativeItems: NonRemunerativeItem[];
    deductionItems: DeductionItem[];
}

interface LiquidacionesContextType {
    liquidaciones: Liquidacion[];
    pinnedItems: PinnedItems[];
    setLiquidaciones: (liquidaciones: Liquidacion[]) => void;
    addLiquidacion: (liquidacion: Liquidacion) => void;
    updateLiquidacion: (liquidacion: Liquidacion) => void;
    deleteLiquidacion: (id: string) => void;
    getLiquidacionesByEmpleado: (empleadoId: string) => Liquidacion[];
    pinItem: (item: SalaryItem | NonRemunerativeItem | DeductionItem, itemType: 'remunerative' | 'nonRemunerative' | 'deduction', empresaId: string) => void;
    unpinItem: (itemId: string, itemType: 'remunerative' | 'nonRemunerative' | 'deduction', empresaId: string) => void;
    getPinnedItemsByEmpresa: (empresaId: string) => PinnedItems | undefined;
}

export const LiquidacionesContext = createContext<LiquidacionesContextType>({
    liquidaciones: [],
    pinnedItems: [],
    setLiquidaciones: () => {},
    addLiquidacion: () => {},
    updateLiquidacion: () => {},
    deleteLiquidacion: () => {},
    getLiquidacionesByEmpleado: () => [],
    pinItem: () => {},
    unpinItem: () => {},
    getPinnedItemsByEmpresa: () => undefined,
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
    
    const [pinnedItems, setPinnedItemsState] = useState<PinnedItems[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pinnedItems');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    
    const { empleados } = usePersonas();

    const setLiquidaciones = (newLiquidaciones: Liquidacion[]) => {
        setLiquidacionesState(newLiquidaciones);
        localStorage.setItem('liquidaciones', JSON.stringify(newLiquidaciones));
    };
    
    const setPinnedItems = (newPinnedItems: PinnedItems[]) => {
        setPinnedItemsState(newPinnedItems);
        localStorage.setItem('pinnedItems', JSON.stringify(newPinnedItems));
    };

    const addLiquidacion = (liquidacion: Liquidacion) => {
        // Asegurarse de que la liquidación tenga las deducciones por defecto
        // Primero creamos una copia profunda de las deducciones por defecto para evitar modificar el original
        const defaultDeductionsCopy = JSON.parse(JSON.stringify(defaultDeductions));
        
        // Inicializamos la nueva liquidación con las deducciones por defecto si no hay deducciones
        // o si las deducciones están vacías
        const newLiquidacion = {
            ...liquidacion,
            deductionItems: Array.isArray(liquidacion.deductionItems) && liquidacion.deductionItems.length > 0
                ? liquidacion.deductionItems
                : defaultDeductionsCopy,
        };
        
        // Inicializamos arrays vacíos si no existen para evitar errores
        if (!newLiquidacion.rowsRemunerative) newLiquidacion.rowsRemunerative = [];
        if (!newLiquidacion.rowsNonRemunerative) newLiquidacion.rowsNonRemunerative = [];
        
        // Buscar el empleado para obtener su empresaId
        const empleado = empleados.find(e => e.id === liquidacion.empleadoId);
        
        // Si hay items fijados para esta empresa, agregarlos a la liquidación si no están ya incluidos
        if (empleado) {
            const empresaPinnedItems = getPinnedItemsByEmpresa(empleado.empresaId);
            if (empresaPinnedItems) {
                // Agregar items remunerativos fijados que no estén ya en la liquidación
                // Solo comparamos por nombre para evitar duplicados
                const remunerativeItemsToAdd = empresaPinnedItems.remunerativeItems.map(pinnedItem => {
                    // Crear una copia del item fijado con isPinned=true para asegurar que se mantiene esta propiedad
                    // Generar un ID basado en el nombre y tipo para mantener consistencia
                    const stableId = `pinned_rem_${pinnedItem.name}_${Date.now()}`;
                    return { ...pinnedItem, id: stableId, isPinned: true };
                }).filter(pinnedItem => 
                    // Solo filtrar si el nombre está vacío
                    pinnedItem.name !== ""
                );
                
                // Agregar items no remunerativos fijados que no estén ya en la liquidación
                const nonRemunerativeItemsToAdd = empresaPinnedItems.nonRemunerativeItems.map(pinnedItem => {
                    // Crear una copia del item fijado con isPinned=true y asegurar que isRemunerative sea false
                    // Generar un ID basado en el nombre y tipo para mantener consistencia
                    const stableId = `pinned_nonrem_${pinnedItem.name}_${Date.now()}`;
                    return { ...pinnedItem, id: stableId, isPinned: true, isRemunerative: false };
                }).filter(pinnedItem => {
                    // Si el nombre está vacío, no agregar
                    if (pinnedItem.name === "") {
                        return false;
                    }
                    
                    // Solo verificar que no sea un item de asistencia o antigüedad
                    return true;
                });
                
                // Agregar items de deducción fijados que no estén ya en la liquidación
                const deductionItemsToAdd = empresaPinnedItems.deductionItems.map(pinnedItem => {
                    // Crear una copia del item fijado con isPinned=true
                    // Generar un ID basado en el nombre y tipo para mantener consistencia
                    const stableId = `pinned_ded_${pinnedItem.name}_${Date.now()}`;
                    return { ...pinnedItem, id: stableId, isPinned: true };
                }).filter(pinnedItem => 
                    // Solo filtrar si el nombre está vacío
                    pinnedItem.name !== ""
                );
                
                // Actualizar la liquidación con los items fijados
                newLiquidacion.rowsRemunerative = [...newLiquidacion.rowsRemunerative, ...remunerativeItemsToAdd];
                // Asegurar que todos los items no remunerativos tengan isRemunerative: false
                // Primero aseguramos que los items existentes tengan isRemunerative: false
                const existingItemsWithCorrectFlag = newLiquidacion.rowsNonRemunerative.map(item => ({ 
                    ...item, 
                    isRemunerative: false 
                }));
                
                // Luego combinamos con los nuevos items (que ya tienen isRemunerative: false asignado)
                newLiquidacion.rowsNonRemunerative = [
                    ...existingItemsWithCorrectFlag,
                    ...nonRemunerativeItemsToAdd
                ];
                newLiquidacion.deductionItems = [...newLiquidacion.deductionItems, ...deductionItemsToAdd];
            }
        }
        
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

    // Funciones para manejar items fijados
    const pinItem = (item: SalaryItem | NonRemunerativeItem | DeductionItem, itemType: 'remunerative' | 'nonRemunerative' | 'deduction', empresaId: string) => {
        // Crear una copia del item con isPinned = true
        const pinnedItem = { ...item, isPinned: true };
        
        // Buscar si ya existe un registro para esta empresa
        const existingIndex = pinnedItems.findIndex(pi => pi.empresaId === empresaId);
        
        if (existingIndex >= 0) {
            // Ya existe un registro para esta empresa
            const updatedPinnedItems = [...pinnedItems];
            const empresaItems = { ...updatedPinnedItems[existingIndex] };
            
            // Actualizar el tipo de item correspondiente
            if (itemType === 'remunerative') {
                // Verificar si el item ya está fijado
                const itemExists = empresaItems.remunerativeItems.some(i => i.id === item.id);
                if (!itemExists) {
                    empresaItems.remunerativeItems = [...empresaItems.remunerativeItems, pinnedItem as SalaryItem];
                }
            } else if (itemType === 'nonRemunerative') {
                // Verificar si el item ya está fijado
                const itemExists = empresaItems.nonRemunerativeItems.some(i => i.id === item.id);
                if (!itemExists) {
                    empresaItems.nonRemunerativeItems = [...empresaItems.nonRemunerativeItems, pinnedItem as NonRemunerativeItem];
                }
            } else if (itemType === 'deduction') {
                // Verificar si el item ya está fijado
                const itemExists = empresaItems.deductionItems.some(i => i.id === item.id);
                if (!itemExists) {
                    empresaItems.deductionItems = [...empresaItems.deductionItems, pinnedItem as DeductionItem];
                }
            }
            
            updatedPinnedItems[existingIndex] = empresaItems;
            setPinnedItems(updatedPinnedItems);
        } else {
            // No existe un registro para esta empresa, crear uno nuevo
            const newEmpresaItems: PinnedItems = {
                empresaId,
                remunerativeItems: [],
                nonRemunerativeItems: [],
                deductionItems: []
            };
            
            // Agregar el item al tipo correspondiente
            if (itemType === 'remunerative') {
                newEmpresaItems.remunerativeItems = [pinnedItem as SalaryItem];
            } else if (itemType === 'nonRemunerative') {
                newEmpresaItems.nonRemunerativeItems = [pinnedItem as NonRemunerativeItem];
            } else if (itemType === 'deduction') {
                newEmpresaItems.deductionItems = [pinnedItem as DeductionItem];
            }
            
            setPinnedItems([...pinnedItems, newEmpresaItems]);
        }
        
        toast.success("Item fijado", {
            description: "El item se ha fijado para futuras liquidaciones en esta empresa.",
        });
    };
    
    const unpinItem = (itemId: string, itemType: 'remunerative' | 'nonRemunerative' | 'deduction', empresaId: string) => {
        // Buscar el registro para esta empresa
        const existingIndex = pinnedItems.findIndex(pi => pi.empresaId === empresaId);
        
        if (existingIndex >= 0) {
            const updatedPinnedItems = [...pinnedItems];
            const empresaItems = { ...updatedPinnedItems[existingIndex] };
            
            // Eliminar el item del tipo correspondiente
            if (itemType === 'remunerative') {
                empresaItems.remunerativeItems = empresaItems.remunerativeItems.filter(i => i.id !== itemId);
            } else if (itemType === 'nonRemunerative') {
                empresaItems.nonRemunerativeItems = empresaItems.nonRemunerativeItems.filter(i => i.id !== itemId);
            } else if (itemType === 'deduction') {
                empresaItems.deductionItems = empresaItems.deductionItems.filter(i => i.id !== itemId);
            }
            
            // Actualizar el registro o eliminarlo si ya no tiene items
            if (
                empresaItems.remunerativeItems.length === 0 &&
                empresaItems.nonRemunerativeItems.length === 0 &&
                empresaItems.deductionItems.length === 0
            ) {
                // Si no quedan items, eliminar el registro completo
                updatedPinnedItems.splice(existingIndex, 1);
            } else {
                // Si aún quedan items, actualizar el registro
                updatedPinnedItems[existingIndex] = empresaItems;
            }
            
            setPinnedItems(updatedPinnedItems);
            
            toast.success("Item desfijado", {
                description: "El item ya no estará fijado para futuras liquidaciones.",
            });
        }
    };
    
    const getPinnedItemsByEmpresa = (empresaId: string): PinnedItems | undefined => {
        return pinnedItems.find(pi => pi.empresaId === empresaId);
    };
    
    return (
        <LiquidacionesContext.Provider
            value={{
                liquidaciones,
                pinnedItems,
                setLiquidaciones,
                addLiquidacion,
                updateLiquidacion,
                deleteLiquidacion,
                getLiquidacionesByEmpleado,
                pinItem,
                unpinItem,
                getPinnedItemsByEmpresa,
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
