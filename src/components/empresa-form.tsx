"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePersonas, type Empresa } from "@/contexts/PersonasContext"

const empresaSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  razonSocial: z.string().min(2, {
    message: "La razón social debe tener al menos 2 caracteres.",
  }),
  cuit: z.string().regex(/^\d{2}-\d{8}-\d$/, {
    message: "El CUIT debe tener el formato XX-XXXXXXXX-X",
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
  descripcion: z.string().optional(),
})

type EmpresaFormValues = z.infer<typeof empresaSchema>

interface EmpresaFormProps {
  empresaToEdit?: Empresa | null
  onSubmitSuccess: () => void
}

export function EmpresaForm({ empresaToEdit, onSubmitSuccess }: EmpresaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addEmpresa, updateEmpresa } = usePersonas()

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresaToEdit || {
      nombre: "",
      razonSocial: "",
      cuit: "",
      domicilio: {
        calle: "",
        numero: "",
        depto: "",
        piso: "",
        ciudad: "",
        provincia: "",
        otro: "",
      },
      descripcion: "",
    },
  })

  useEffect(() => {
    if (empresaToEdit) {
      form.reset(empresaToEdit)
    }
  }, [empresaToEdit, form])

  function onSubmit(values: EmpresaFormValues) {
    setIsSubmitting(true)
    if (empresaToEdit) {
      updateEmpresa({ ...values, id: empresaToEdit.id })
      toast.success("Empresa actualizada", {
        description: "La empresa se ha actualizado correctamente.",
      })
    } else {
      addEmpresa(values)
      toast.success("Empresa guardada", {
        description: "La empresa se ha guardado correctamente.",
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
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="razonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Razón social de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CUIT</FormLabel>
              <FormControl>
                <Input placeholder="XX-XXXXXXXX-X" {...field} />
              </FormControl>
              <FormDescription>Formato: XX-XXXXXXXX-X (sin espacios)</FormDescription>
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
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción de la empresa" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : empresaToEdit ? "Actualizar empresa" : "Guardar empresa"}
        </Button>
      </form>
    </Form>
  )
}

