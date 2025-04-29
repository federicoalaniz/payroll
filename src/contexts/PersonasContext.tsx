"use client";

import { createContext, useContext, useState } from "react";

export interface Domicilio {
    calle: string;
    numero: string;
    piso?: string;
    depto?: string;
    localidad: string;
    provincia: string;
}

export interface Empresa {
    id: string;
    nombre: string;
    razonSocial: string;
    cuit: string;
    telefono: string;
    email?: string;
    domicilio: Domicilio;
    descripcion?: string;
}

export interface Empleado {
    id: string;
    apellido: string;
    nombre: string;
    cuil: string;
    dni: string;
    telefono: string;
    email?: string;
    foto?: string;
    genero: 'masculino' | 'femenino' | 'no_declara';
    fechaNacimiento: string;
    cantidadHijos: number;
    activo: boolean;
    fechaBaja?: string;
    motivoBaja?: 'renuncia' | 'despido' | 'finalizacion_de_contrato';
    domicilio: Domicilio;
    categoria?: string;
    subCategoria?: string;
    fechaIngreso: string;
    empresaId: string;
}

interface PersonasContextType {
    empleados: Empleado[];
    empresas: Empresa[];
    setEmpleados: (empleados: Empleado[]) => void;
    setEmpresas: (empresas: Empresa[]) => void;
    addEmpleado: (empleado: Empleado) => void;
    addEmpresa: (empresa: Empresa) => void;
    updateEmpleado: (empleado: Empleado) => void;
    updateEmpresa: (empresa: Empresa) => void;
    deleteEmpleado: (id: string) => void;
    deleteEmpresa: (id: string) => void;
}

export const PersonasContext = createContext<PersonasContextType>({
    empleados: [],
    empresas: [],
    setEmpleados: () => {},
    setEmpresas: () => {},
    addEmpleado: () => {},
    addEmpresa: () => {},
    updateEmpleado: () => {},
    updateEmpresa: () => {},
    deleteEmpleado: () => {},
    deleteEmpresa: () => {},
});

export function PersonasProvider({ children }: { children: React.ReactNode }) {
    const [empleados, setEmpleadosState] = useState<Empleado[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('empleados');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [empresas, setEmpresasState] = useState<Empresa[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('empresas');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const setEmpleados = (newEmpleados: Empleado[]) => {
        setEmpleadosState(newEmpleados);
        localStorage.setItem('empleados', JSON.stringify(newEmpleados));
    };

    const setEmpresas = (newEmpresas: Empresa[]) => {
        setEmpresasState(newEmpresas);
        localStorage.setItem('empresas', JSON.stringify(newEmpresas));
    };

    const addEmpleado = (empleado: Empleado) => {
        const newEmpleados = [...empleados, empleado];
        setEmpleados(newEmpleados);
    };

    const addEmpresa = (empresa: Empresa) => {
        const newEmpresas = [...empresas, empresa];
        setEmpresas(newEmpresas);
    };

    const updateEmpleado = (empleado: Empleado) => {
        const newEmpleados = empleados.map((e) => (e.id === empleado.id ? empleado : e));
        setEmpleados(newEmpleados);
    };

    const updateEmpresa = (empresa: Empresa) => {
        const newEmpresas = empresas.map((e) => (e.id === empresa.id ? empresa : e));
        setEmpresas(newEmpresas);
    };

    const deleteEmpleado = (id: string) => {
        const newEmpleados = empleados.filter((e) => e.id !== id);
        setEmpleados(newEmpleados);
    };

    const deleteEmpresa = (id: string) => {
        const newEmpresas = empresas.filter((e) => e.id !== id);
        setEmpresas(newEmpresas);
    };

    return (
        <PersonasContext.Provider
            value={{
                empleados,
                empresas,
                setEmpleados,
                setEmpresas,
                addEmpleado,
                addEmpresa,
                updateEmpleado,
                updateEmpresa,
                deleteEmpleado,
                deleteEmpresa,
            }}
        >
            {children}
        </PersonasContext.Provider>
    );
}

export function usePersonas() {
    const context = useContext(PersonasContext);
    if (!context) {
        throw new Error("usePersonas must be used within a PersonasProvider");
    }
    return context;
}
