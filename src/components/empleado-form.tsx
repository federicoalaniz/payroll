"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePersonas, type Empleado } from "@/contexts/PersonasContext"

const empleadoSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  cuil: z.string().regex(/^\d{2}-\d{8}-\d$/, {
    message: "El CUIL debe tener el formato XX-XXXXXXXX-X",
  }),
  dni: z.string().regex(/^\d{2}\.\d{3}\.\d{3}$/, {
    message: "El DNI debe tener el formato XX.XXX.XXX",
  }),
  domicilio: z.object({
    calle: z.string().min(1, { message: "La calle es requerida" }),
    numero: z.string().optional(),
    depto: z.string().optional(),
    piso: z.string().optional(),
    ciudad: z.string().min(1, { message: "La ciudad es requerida" }),
    provincia: z.string().min(1, { message: "La provincia es requerida" }),
    otro: z.string().optional(),
  }),
  categoria: z.string().optional(),
  subCategoria: z.string().optional(),
  fechaIngreso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La fecha debe tener el formato YYYY-MM-DD",
  }),
  empresaId: z.string({
    required_error: "Por favor seleccione una empresa",
  }),
})

type EmpleadoFormValues = z.infer<typeof empleadoSchema>

interface EmpleadoFormProps {
  empleadoToEdit?: Empleado | null
  onSubmitSuccess: () => void
}

export function EmpleadoForm({ empleadoToEdit, onSubmitSuccess }: EmpleadoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addEmpleado, updateEmpleado, empresas } = usePersonas()

  const form = useForm<EmpleadoFormValues>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: empleadoToEdit || {
      nombre: "",
      cuil: "",
      dni: "",
      domicilio: {
        calle: "",
        numero: "",
        depto: "",
        piso: "",
        ciudad: "",
        provincia: "",
        otro: "",
      },
      categoria: "",
      subCategoria: "",
      fechaIngreso: "",
      empresaId: "",
    },
  })

  useEffect(() => {
    if (empleadoToEdit) {
      form.reset(empleadoToEdit)
    }
  }, [empleadoToEdit, form])

  function onSubmit(values: EmpleadoFormValues) {
    setIsSubmitting(true)
    if (empleadoToEdit) {
      updateEmpleado({ ...values, id: empleadoToEdit.id })
      toast.success("Empleado actualizado", {
        description: "El empleado se ha actualizado correctamente.",
      })
    } else {
      addEmpleado(values)
      toast.success("Empleado guardado", {
        description: "El empleado se ha guardado correctamente.",
      })
    }
    setIsSubmitting(false)
    form.reset()
    onSubmitSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del empleado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CUIL</FormLabel>
              <FormControl>
                <Input placeholder="XX-XXXXXXXX-X" {...field} />
              </FormControl>
              <FormDescription>Formato: XX-XXXXXXXX-X (sin espacios)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input placeholder="XX.XXX.XXX" {...field} />
              </FormControl>
              <FormDescription>Formato: XX.XXX.XXX (con puntos)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Domicilio</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="domicilio.calle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domicilio.numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="domicilio.depto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domicilio.piso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piso</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="domicilio.ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domicilio.provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="domicilio.otro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Información adicional</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subCategoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategoría</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fechaIngreso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de ingreso</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Formato: YYYY-MM-DD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="empresaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : empleadoToEdit ? "Actualizar empleado" : "Guardar empleado"}
        </Button>
      </form>
    </Form>
  )
}

