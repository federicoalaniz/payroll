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
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    const addEmpleado = (empleado: Empleado) => {
        setEmpleados([...empleados, empleado]);
    };

    const addEmpresa = (empresa: Empresa) => {
        setEmpresas([...empresas, empresa]);
    };

    const updateEmpleado = (empleado: Empleado) => {
        setEmpleados(
            empleados.map((e) => (e.id === empleado.id ? empleado : e))
        );
    };

    const updateEmpresa = (empresa: Empresa) => {
        setEmpresas(empresas.map((e) => (e.id === empresa.id ? empresa : e)));
    };

    const deleteEmpleado = (id: string) => {
        setEmpleados(empleados.filter((e) => e.id !== id));
    };

    const deleteEmpresa = (id: string) => {
        setEmpresas(empresas.filter((e) => e.id !== id));
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
