"use client";

import { usePersonas } from "@/contexts/PersonasContext";
import { useLiquidaciones } from "@/contexts/LiquidacionesContext";

const empresas = [
    {
        id: "1",
        nombre: "Constructora del Sur S.A.",
        razonSocial: "Constructora del Sur S.A.",
        cuit: "30-71234567-8",
        domicilio: {
            calle: "Av. Rivadavia",
            numero: "1550",
            localidad: "San Miguel de Tucumán",
            provincia: "Tucumán",
            codigoPostal: "4000"
        }
    },
    {
        id: "2",
        nombre: "Metalúrgica Norte S.R.L.",
        razonSocial: "Metalúrgica Norte S.R.L.",
        cuit: "30-76543210-9",
        domicilio: {
            calle: "Av. San Martín",
            numero: "2340",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    }
];

const empleados = [
    // Empleados Constructora del Sur
    {
        id: "1",
        empresaId: "1",
        nombre: "Juan Pérez",
        cuil: "20-25678901-3",
        dni: "25678901",
        fechaIngreso: "2020-03-15",
        categoria: "Oficial Especializado",
        domicilio: {
            calle: "25 de Mayo",
            numero: "123",
            localidad: "San Miguel de Tucumán",
            provincia: "Tucumán",
            codigoPostal: "4000"
        }
    },
    {
        id: "2",
        empresaId: "1",
        nombre: "María González",
        cuil: "27-30987654-1",
        dni: "30987654",
        fechaIngreso: "2021-06-01",
        categoria: "Administrativo",
        domicilio: {
            calle: "Laprida",
            numero: "456",
            localidad: "San Miguel de Tucumán",
            provincia: "Tucumán",
            codigoPostal: "4000"
        }
    },
    {
        id: "3",
        empresaId: "1",
        nombre: "Carlos Rodríguez",
        cuil: "20-28765432-4",
        dni: "28765432",
        fechaIngreso: "2019-11-20",
        categoria: "Oficial",
        domicilio: {
            calle: "San Lorenzo",
            numero: "789",
            localidad: "Yerba Buena",
            provincia: "Tucumán",
            codigoPostal: "4107"
        }
    },
    {
        id: "4",
        empresaId: "1",
        nombre: "Ana Martínez",
        cuil: "27-32123456-2",
        dni: "32123456",
        fechaIngreso: "2022-02-15",
        categoria: "Medio Oficial",
        domicilio: {
            calle: "Belgrano",
            numero: "234",
            localidad: "San Miguel de Tucumán",
            provincia: "Tucumán",
            codigoPostal: "4000"
        }
    },
    {
        id: "5",
        empresaId: "1",
        nombre: "Luis Sánchez",
        cuil: "20-27654321-5",
        dni: "27654321",
        fechaIngreso: "2020-09-10",
        categoria: "Capataz",
        domicilio: {
            calle: "9 de Julio",
            numero: "567",
            localidad: "San Miguel de Tucumán",
            provincia: "Tucumán",
            codigoPostal: "4000"
        }
    },
    // Empleados Metalúrgica Norte
    {
        id: "6",
        empresaId: "2",
        nombre: "Roberto López",
        cuil: "20-29876543-6",
        dni: "29876543",
        fechaIngreso: "2021-03-01",
        categoria: "Soldador",
        domicilio: {
            calle: "Alvear",
            numero: "890",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    },
    {
        id: "7",
        empresaId: "2",
        nombre: "Patricia Díaz",
        cuil: "27-31234567-3",
        dni: "31234567",
        fechaIngreso: "2020-07-15",
        categoria: "Administrativa",
        domicilio: {
            calle: "Güemes",
            numero: "123",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    },
    {
        id: "8",
        empresaId: "2",
        nombre: "Miguel Fernández",
        cuil: "20-26789012-7",
        dni: "26789012",
        fechaIngreso: "2019-12-01",
        categoria: "Tornero",
        domicilio: {
            calle: "Lavalle",
            numero: "456",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    },
    {
        id: "9",
        empresaId: "2",
        nombre: "Laura Torres",
        cuil: "27-33210987-4",
        dni: "33210987",
        fechaIngreso: "2022-01-10",
        categoria: "Operaria",
        domicilio: {
            calle: "Necochea",
            numero: "789",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    },
    {
        id: "10",
        empresaId: "2",
        nombre: "Diego Ramírez",
        cuil: "20-28901234-8",
        dni: "28901234",
        fechaIngreso: "2020-11-20",
        categoria: "Fresador",
        domicilio: {
            calle: "Sarmiento",
            numero: "012",
            localidad: "San Salvador de Jujuy",
            provincia: "Jujuy",
            codigoPostal: "4600"
        }
    }
];

function generateLiquidaciones() {
    const liquidaciones = [];
    const meses = ['01', '02', '03', '04', '05'];
    let liquidacionId = 1;

    empleados.forEach(empleado => {
        meses.forEach(mes => {
            const basicSalary = (200000 + Math.random() * 100000).toFixed(2).replace('.', ',');
            const totalRemunerativo = (parseFloat(basicSalary.replace(',', '.')) * 1.1).toFixed(2).replace('.', ',');
            const totalNoRemunerativo = (parseFloat(basicSalary.replace(',', '.')) * 0.15).toFixed(2).replace('.', ',');
            const totalDeducciones = (parseFloat(basicSalary.replace(',', '.')) * 0.22).toFixed(2).replace('.', ',');
            const totalNeto = (parseFloat(totalRemunerativo.replace(',', '.')) + 
                             parseFloat(totalNoRemunerativo.replace(',', '.')) - 
                             parseFloat(totalDeducciones.replace(',', '.'))).toFixed(2).replace('.', ',');

            liquidaciones.push({
                id: liquidacionId.toString(),
                empleadoId: empleado.id,
                fecha: `2024-${mes}-01`,
                periodo: `2024-${mes}`,
                basicSalary,
                startDate: empleado.fechaIngreso,
                presentismoPercentage: "8,33",
                rowsRemunerative: [
                    {
                        id: "1",
                        name: "Presentismo",
                        percentage: "8,33",
                        amount: (parseFloat(basicSalary.replace(',', '.')) * 0.0833).toFixed(2).replace('.', ','),
                        checked: true,
                        isAttendanceRow: true
                    }
                ],
                rowsNonRemunerative: [
                    {
                        id: "1",
                        name: "Bono por productividad",
                        percentage: "15",
                        amount: (parseFloat(basicSalary.replace(',', '.')) * 0.15).toFixed(2).replace('.', ','),
                        checked: true,
                        isRemunerative: false
                    }
                ],
                deductionItems: [
                    {
                        id: "1",
                        name: "Jubilación",
                        percentage: "11",
                        amount: (parseFloat(totalRemunerativo.replace(',', '.')) * 0.11).toFixed(2).replace('.', ','),
                        checked: true,
                        checkedRemunerative: true,
                        checkedNonRemunerative: false,
                        remunerativeAmount: (parseFloat(totalRemunerativo.replace(',', '.')) * 0.11).toFixed(2).replace('.', ','),
                        nonRemunerativeAmount: "0,00"
                    },
                    {
                        id: "2",
                        name: "Obra Social",
                        percentage: "3",
                        amount: (parseFloat(totalRemunerativo.replace(',', '.')) * 0.03).toFixed(2).replace('.', ','),
                        checked: true,
                        checkedRemunerative: true,
                        checkedNonRemunerative: false,
                        remunerativeAmount: (parseFloat(totalRemunerativo.replace(',', '.')) * 0.03).toFixed(2).replace('.', ','),
                        nonRemunerativeAmount: "0,00"
                    }
                ],
                totalRemunerativo,
                totalNoRemunerativo,
                totalDeducciones,
                totalNeto
            });
            liquidacionId++;
        });
    });

    return liquidaciones;
}

export function PopulateSampleData() {
    const { setEmpresas, setEmpleados } = usePersonas();
    const { setLiquidaciones } = useLiquidaciones();

    const handlePopulate = () => {
        setEmpresas(empresas);
        setEmpleados(empleados);
        setLiquidaciones(generateLiquidaciones());
    };

    return (
        <button
            onClick={handlePopulate}
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
            Cargar Datos de Ejemplo
        </button>
    );
}