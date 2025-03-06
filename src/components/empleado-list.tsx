"use client"

import { TableHeader } from "@/components/ui/table"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { usePersonas, type Empleado } from "@/contexts/PersonasContext"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface EmpleadoListProps {
  onSelectEmpleado: (empleado: Empleado | null) => void
}

export function EmpleadoList({ onSelectEmpleado }: EmpleadoListProps) {
  const { empleados, empresas, deleteEmpleado } = usePersonas()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const getEmpresaNombre = (empresaId: string) => {
    const empresa = empresas.find((e) => e.id === empresaId)
    return empresa ? empresa.nombre : "N/A"
  }

  const handleRowClick = (empleado: Empleado) => {
    setSelectedId(empleado.id)
    onSelectEmpleado(empleado)
  }

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    deleteEmpleado(id)
    toast.success("Empleado eliminado", {
      description: "El empleado se ha eliminado correctamente.",
    })
    if (selectedId === id) {
      setSelectedId(null)
      onSelectEmpleado(null)
    }
  }

  return (
    <Table>
      <TableCaption>Lista de empleados registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>CUIL</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>Fecha de Ingreso</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empleados.map((empleado) => (
          <TableRow
            key={empleado.id}
            onClick={() => handleRowClick(empleado)}
            className={`cursor-pointer ${selectedId === empleado.id ? "bg-muted" : ""}`}
          >
            <TableCell>{empleado.nombre}</TableCell>
            <TableCell>{empleado.cuil}</TableCell>
            <TableCell>{empleado.dni}</TableCell>
            <TableCell>{empleado.fechaIngreso}</TableCell>
            <TableCell>{getEmpresaNombre(empleado.empresaId)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={(e) => handleDelete(empleado.id, e)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

