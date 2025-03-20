"use client";

import { useEffect, useState } from "react";
import { usePersonas } from "@/contexts/PersonasContext";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Domicilio } from "@/contexts/PersonasContext";

interface LiquidacionHeaderProps {
    empleadoId: string;
}

// Type guard para verificar si un domicilio es válido
const isDomicilioValid = (domicilio: Domicilio | undefined): domicilio is Domicilio => {
    return domicilio !== undefined && 
        typeof domicilio.calle === "string" &&
        typeof domicilio.numero === "string";
};

export function LiquidacionHeader({ empleadoId }: LiquidacionHeaderProps) {
    const { empleados, empresas } = usePersonas();
    const [empleado, setEmpleado] = useState(
        empleados.find((e) => e.id === empleadoId)
    );
    const [empresa, setEmpresa] = useState<typeof empresas[0] | undefined>();

    useEffect(() => {
        const empleadoFound = empleados.find((e) => e.id === empleadoId);
        setEmpleado(empleadoFound);
        if (empleadoFound) {
            const empresaFound = empresas.find(
                (e) => e.id === empleadoFound.empresaId
            );
            setEmpresa(empresaFound);
        }
    }, [empleadoId, empleados, empresas]);

    if (!empleado || !empresa) {
        return null;
    }

    // Componente para mostrar un domicilio
    const DomicilioDisplay = ({ domicilio }: { domicilio: Domicilio | undefined }) => {
        if (!isDomicilioValid(domicilio)) {
            return <p className="text-sm text-muted-foreground">No disponible</p>;
        }

        return (
            <>
                <p className="text-sm">
                    {domicilio.calle} {domicilio.numero}
                    {domicilio.piso && `, Piso ${domicilio.piso}`}
                    {domicilio.depto && `, Depto ${domicilio.depto}`}
                </p>
                <p className="text-sm">
                    {domicilio.localidad}, {domicilio.provincia}
                </p>
            </>
        );
    };

    return (
        <Card className="border-2 border-gray-500 shadow-none">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label>Empresa</Label>
                            <p className="text-lg font-medium">{empresa.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                                CUIT: {empresa.cuit}
                            </p>
                        </div>
                        <div>
                            <Label>Domicilio</Label>
                            <DomicilioDisplay domicilio={empresa.domicilio} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Empleado</Label>
                            <p className="text-lg font-medium">{empleado.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                                CUIL: {empleado.cuil}
                            </p>
                        </div>
                        <div>
                            <Label>Domicilio</Label>
                            <DomicilioDisplay domicilio={empleado.domicilio} />
                        </div>
                        <div>
                            <Label>Categoría</Label>
                            <p className="text-sm">
                                {empleado.categoria || "No especificada"}
                                {empleado.subCategoria && ` - ${empleado.subCategoria}`}
                            </p>
                        </div>
                        <div>
                            <Label>Fecha de Ingreso</Label>
                            <p className="text-sm">{formatDate(empleado.fechaIngreso)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
