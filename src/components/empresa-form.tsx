"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePersonas, type Empresa } from "@/contexts/PersonasContext"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import crypto from "crypto"
import { formatCUITCUIL } from "@/lib/input-masks"
import { ProvinceSelect } from "@/lib/provinces"
import { localities } from "@/lib/localities"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  razonSocial: z.string().min(1, { message: "La razón social es requerida" }),
  cuit: z.string().min(1, { message: "El CUIT es requerido" }),
  telefono: z.string().min(1, { message: "El teléfono es requerido" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  domicilio: z.object({
    calle: z.string().min(1, { message: "La calle es requerida" }),
    numero: z.string().min(1, { message: "El número es requerido" }),
    piso: z.string().optional(),
    depto: z.string().optional(),
    localidad: z.string().min(1, { message: "La localidad es requerida" }),
    provincia: z.string().min(1, { message: "La provincia es requerida" }),
  }),
  descripcion: z.string().optional(),
});

type EmpresaFormValues = z.infer<typeof formSchema>

interface EmpresaFormProps {
  empresaToEdit?: Empresa
  onSuccess?: () => void
}

export function EmpresaForm({ empresaToEdit, onSuccess }: EmpresaFormProps) {
  const { addEmpresa, updateEmpresa } = usePersonas()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: empresaToEdit || {
      nombre: "",
      razonSocial: "",
      cuit: "",
      telefono: "",
      email: "",
      domicilio: {
        calle: "",
        numero: "",
        piso: "",
        depto: "",
        localidad: "",
        provincia: "",
      },
      descripcion: "",
    },
  })

  useEffect(() => {
    if (empresaToEdit) {
      form.reset(empresaToEdit)
    }
  }, [empresaToEdit, form])

  async function onSubmit(values: EmpresaFormValues) {
    setIsSubmitting(true)
    try {
      if (empresaToEdit) {
        await updateEmpresa({ ...values, id: empresaToEdit.id })
        toast("Empresa actualizada exitosamente")
      } else {
        await addEmpresa({ ...values, id: crypto.randomUUID() })
        toast("Empresa creada exitosamente")
      }
      onSuccess?.()
      form.reset()
    } catch {
      toast("Error al guardar la empresa", {
        style: { background: "red", color: "white" }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de la Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Nombre
                    </FormLabel>
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Razón Social
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Razón social" {...field} />
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      CUIT
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00-00000000-0" 
                        {...field} 
                        onChange={(e) => field.onChange(formatCUITCUIL(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ejemplo@email.com" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la empresa"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Domicilio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="domicilio.calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Calle
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Calle" {...field} />
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Número
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
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
                      <Input placeholder="1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domicilio.depto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depto</FormLabel>
                    <FormControl>
                      <Input placeholder="A" {...field} value={field.value || ""} />
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Provincia
                    </FormLabel>
                    <FormControl>
                      <ProvinceSelect
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domicilio.localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Localidad
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={!form.watch("domicilio.provincia")}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una localidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.watch("domicilio.provincia") &&
                            localities[form.watch("domicilio.provincia")].map(
                              (locality) => (
                                <SelectItem key={locality} value={`${locality}|${locality}`}>
                                  {locality}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {empresaToEdit ? "Guardar cambios" : "Crear empresa"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
