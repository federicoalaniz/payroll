"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";

type Domicilio = {
    calle: string;
    numero?: string;
    depto?: string;
    piso?: string;
    ciudad: string;
    provincia: string;
    otro?: string;
};

export type Empresa = {
    id: string;
    nombre: string;
    razonSocial: string;
    cuit: string;
    domicilio: Domicilio;
    descripcion?: string;
};

export type Empleado = {
    id: string;
    nombre: string;
    cuil: string;
    dni: string;
    domicilio: Domicilio;
    categoria?: string;
    subCategoria?: string;
    fechaIngreso: string;
    empresaId: string;
};

type PersonasContextType = {
    empresas: Empresa[];
    empleados: Empleado[];
    addEmpresa: (empresa: Omit<Empresa, "id">) => void;
    addEmpleado: (empleado: Omit<Empleado, "id">) => void;
    updateEmpresa: (empresa: Empresa) => void;
    updateEmpleado: (empleado: Empleado) => void;
    deleteEmpresa: (id: string) => void;
    deleteEmpleado: (id: string) => void;
};

const PersonasContext = createContext<PersonasContextType | undefined>(
    undefined
);

const empresasEjemplo: Empresa[] = [
    {
        id: "1",
        nombre: "TechSolutions SA",
        razonSocial: "TechSolutions Sociedad Anónima",
        cuit: "30-12345678-9",
        domicilio: {
            calle: "Av. Tecnología",
            numero: "123",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        descripcion: "Empresa líder en soluciones tecnológicas",
    },
    {
        id: "2",
        nombre: "EcoInnovations SRL",
        razonSocial: "EcoInnovations Sociedad de Responsabilidad Limitada",
        cuit: "30-98765432-1",
        domicilio: {
            calle: "Calle Verde",
            numero: "456",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        descripcion: "Innovación en productos ecológicos",
    },
];

const empleadosEjemplo: Empleado[] = [
    {
        id: "1",
        nombre: "Juan Pérez",
        cuil: "20-12345678-9",
        dni: "12.345.678",
        domicilio: {
            calle: "Calle 1",
            numero: "123",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        categoria: "Desarrollador",
        subCategoria: "Senior",
        fechaIngreso: "2020-01-15",
        empresaId: "1",
    },
    {
        id: "2",
        nombre: "María González",
        cuil: "27-23456789-0",
        dni: "23.456.789",
        domicilio: {
            calle: "Avenida 2",
            numero: "456",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        categoria: "Diseñadora",
        subCategoria: "UX/UI",
        fechaIngreso: "2021-03-01",
        empresaId: "1",
    },
    {
        id: "3",
        nombre: "Carlos Rodríguez",
        cuil: "20-34567890-1",
        dni: "34.567.890",
        domicilio: {
            calle: "Calle 3",
            numero: "789",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        categoria: "Analista",
        subCategoria: "Datos",
        fechaIngreso: "2019-11-10",
        empresaId: "1",
    },
    {
        id: "4",
        nombre: "Ana Martínez",
        cuil: "27-45678901-2",
        dni: "45.678.901",
        domicilio: {
            calle: "Avenida 4",
            numero: "1011",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        categoria: "Gerente",
        subCategoria: "Proyectos",
        fechaIngreso: "2018-07-20",
        empresaId: "1",
    },
    {
        id: "5",
        nombre: "Luis Sánchez",
        cuil: "20-56789012-3",
        dni: "56.789.012",
        domicilio: {
            calle: "Calle 5",
            numero: "1213",
            ciudad: "Buenos Aires",
            provincia: "Buenos Aires",
        },
        categoria: "Desarrollador",
        subCategoria: "Frontend",
        fechaIngreso: "2022-02-01",
        empresaId: "1",
    },
    {
        id: "6",
        nombre: "Laura Fernández",
        cuil: "27-67890123-4",
        dni: "67.890.123",
        domicilio: {
            calle: "Calle Verde",
            numero: "101",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        categoria: "Investigador",
        subCategoria: "Materiales",
        fechaIngreso: "2020-06-15",
        empresaId: "2",
    },
    {
        id: "7",
        nombre: "Martín López",
        cuil: "20-78901234-5",
        dni: "78.901.234",
        domicilio: {
            calle: "Avenida Eco",
            numero: "202",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        categoria: "Ingeniero",
        subCategoria: "Ambiental",
        fechaIngreso: "2019-09-01",
        empresaId: "2",
    },
    {
        id: "8",
        nombre: "Sofía Ramírez",
        cuil: "27-89012345-6",
        dni: "89.012.345",
        domicilio: {
            calle: "Pasaje Innovación",
            numero: "303",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        categoria: "Diseñadora",
        subCategoria: "Producto",
        fechaIngreso: "2021-11-10",
        empresaId: "2",
    },
    {
        id: "9",
        nombre: "Diego Torres",
        cuil: "20-90123456-7",
        dni: "90.123.456",
        domicilio: {
            calle: "Calle Sustentable",
            numero: "404",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        categoria: "Analista",
        subCategoria: "Mercado",
        fechaIngreso: "2020-03-20",
        empresaId: "2",
    },
    {
        id: "10",
        nombre: "Valentina Herrera",
        cuil: "27-01234567-8",
        dni: "01.234.567",
        domicilio: {
            calle: "Avenida Reciclaje",
            numero: "505",
            ciudad: "Córdoba",
            provincia: "Córdoba",
        },
        categoria: "Gerente",
        subCategoria: "Operaciones",
        fechaIngreso: "2018-12-01",
        empresaId: "2",
    },
];

export const PersonasProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [empresas, setEmpresas] = useState<Empresa[]>(empresasEjemplo);
    const [empleados, setEmpleados] = useState<Empleado[]>(empleadosEjemplo);

    const addEmpresa = (empresa: Omit<Empresa, "id">) => {
        const newEmpresa = { ...empresa, id: Date.now().toString() };
        setEmpresas([...empresas, newEmpresa]);
    };

    const addEmpleado = (empleado: Omit<Empleado, "id">) => {
        const newEmpleado = { ...empleado, id: Date.now().toString() };
        setEmpleados([...empleados, newEmpleado]);
    };

    const updateEmpresa = (updatedEmpresa: Empresa) => {
        setEmpresas(
            empresas.map((empresa) =>
                empresa.id === updatedEmpresa.id ? updatedEmpresa : empresa
            )
        );
    };

    const updateEmpleado = (updatedEmpleado: Empleado) => {
        setEmpleados(
            empleados.map((empleado) =>
                empleado.id === updatedEmpleado.id ? updatedEmpleado : empleado
            )
        );
    };

    const deleteEmpresa = (id: string) => {
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
        setEmpleados(empleados.filter((empleado) => empleado.empresaId !== id));
    };

    const deleteEmpleado = (id: string) => {
        setEmpleados(empleados.filter((empleado) => empleado.id !== id));
    };

    return (
        <PersonasContext.Provider
            value={{
                empresas,
                empleados,
                addEmpresa,
                addEmpleado,
                updateEmpresa,
                updateEmpleado,
                deleteEmpresa,
                deleteEmpleado,
            }}
        >
            {children}
        </PersonasContext.Provider>
    );
};

export const usePersonas = () => {
    const context = useContext(PersonasContext);
    if (context === undefined) {
        throw new Error("usePersonas must be used within a PersonasProvider");
    }
    return context;
};
