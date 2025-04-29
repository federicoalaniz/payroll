"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { usePersonas, type Empleado } from "@/contexts/PersonasContext"
import { ProvinceSelect } from "@/lib/provinces"
import { FotoUpload } from "./foto-upload"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
// import { v4 as uuidv4 } from "uuid"
import { formatCUITCUIL } from "@/lib/input-masks"
import { fetchLocalitiesByProvince } from "@/lib/locality-service"

const empleadoSchema = z.object({
  apellido: z.string().min(1, { message: "El apellido es requerido" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  cuil: z.string().min(1, { message: "El CUIL es requerido" }),
  dni: z.string().min(1, { message: "El DNI es requerido" }),
  telefono: z.string().min(1, { message: "El teléfono es requerido" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  foto: z.string().optional(),
  genero: z.enum(["masculino", "femenino", "no_declara"], {
    required_error: "El género es requerido",
  }),
  fechaNacimiento: z.string().min(1, { message: "La fecha de nacimiento es requerida" }),
  cantidadHijos: z.number().default(0),
  activo: z.boolean().default(true),
  fechaBaja: z.string().optional(),
  motivoBaja: z.enum(["renuncia", "despido", "finalizacion_de_contrato"]).optional(),
  domicilio: z.object({
    calle: z.string().min(1, { message: "La calle es requerida" }),
    numero: z.string().min(1, { message: "El número es requerido" }),
    depto: z.string().optional(),
    piso: z.string().optional(),
    localidad: z.string().min(1, { message: "La localidad es requerida" }),
    provincia: z.string().min(1, { message: "La provincia es requerida" }),
  }),
  categoria: z.string().optional(),
  subCategoria: z.string().optional(),
  fechaIngreso: z.string().min(1, {
    message: "La fecha de ingreso es requerida",
  }),
  empresaId: z.string().min(1, {
    message: "La empresa es requerida",
  }),
})

type EmpleadoFormValues = z.infer<typeof empleadoSchema>

interface EmpleadoFormProps {
  empleadoToEdit?: Empleado
  onSuccess?: () => void
}

export function EmpleadoForm({ empleadoToEdit, onSuccess }: EmpleadoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localities, setLocalities] = useState<string[]>([])
  const { addEmpleado, updateEmpleado, empresas } = usePersonas()

  const form = useForm<EmpleadoFormValues>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: empleadoToEdit || {
      apellido: "",
      nombre: "",
      cuil: "",
      dni: "",
      telefono: "",
      email: "",
      foto: "",
      genero: "no_declara",
      domicilio: {
        calle: "",
        numero: "",
        depto: "",
        piso: "",
        localidad: "",
        provincia: "",
      },
      categoria: "",
      subCategoria: "",
      fechaIngreso: "",
      empresaId: "",
      fechaNacimiento: "",
      cantidadHijos: 0,
      activo: true,
      fechaBaja: "",
      motivoBaja: undefined,
    },
  })

  useEffect(() => {
    if (empleadoToEdit) {
      form.reset(empleadoToEdit)
    }
  }, [empleadoToEdit, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "domicilio.provincia") {
        const provincia = value.domicilio?.provincia
        if (provincia) {
          fetchLocalitiesByProvince(provincia)
            .then(localidades => {
              setLocalities(localidades.map(localidad => localidad.nombre))
              // Reset locality if province changes
              if (form.getValues("domicilio.localidad")) {
                form.setValue("domicilio.localidad", "")
              }
            })
            .catch(error => {
              console.error("Error fetching localities:", error)
              setLocalities([])
            })
        } else {
          setLocalities([])
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: EmpleadoFormValues) {
    setIsSubmitting(true)
    try {
      if (empleadoToEdit) {
        await updateEmpleado({ ...values, id: empleadoToEdit.id })
        toast("Empleado actualizado exitosamente")
      } else {
        await addEmpleado({ ...values, id: uuidv4() })
        toast("Empleado creado exitosamente")
      }
      onSuccess?.()
      form.reset()
    } catch {
      toast("Error al guardar el empleado", {
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
            <h3 className="text-lg font-medium">Datos del Empleado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Make photo upload span full width */}
              <div className="col-span-full mb-4">
                <FormField
                  control={form.control}
                  name="foto"
                  render={({ field }) => (
                    <FotoUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              {/* Row 1: Apellido - Nombre */}
              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 2: CUIL - DNI */}
              <FormField
                control={form.control}
                name="cuil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      CUIL
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
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      DNI
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="00000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 3: Género (full width) */}
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                        Género
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un género" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="femenino">Femenino</SelectItem>
                            <SelectItem value="no_declara">No declara</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 4: Teléfono - Email */}
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
              {/* Row 5: Fecha de nacimiento - Cantidad de hijos */}
              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Fecha de Nacimiento
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cantidadHijos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Hijos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Rest of the form (Datos Laborales and Domicilio sections) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos Laborales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="empresaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Empresa
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.id}>
                              {empresa.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Fecha de Ingreso
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Categoría" {...field} value={field.value || ""} />
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
                      <Input placeholder="Subcategoría" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 5: Fecha de Nacimiento - Cantidad de Hijos */}
              
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
                          {localities.map((locality) => (
                            <SelectItem key={locality} value={locality}>
                              {locality}
                            </SelectItem>
                          ))}
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Estado del Empleado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Empleado Activo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {!form.watch("activo") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaBaja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Baja</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motivoBaja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de Baja</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="renuncia">Renuncia</SelectItem>
                        <SelectItem value="despido">Despido</SelectItem>
                        <SelectItem value="finalizacion_de_contrato">Finalización de Contrato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {empleadoToEdit ? "Guardar cambios" : "Crear empleado"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
