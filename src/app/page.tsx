"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/navigationbar"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // O podrías mostrar un indicador de carga aquí
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 pt-16">
        <h1 className="text-2xl font-bold">Bienvenido, {user.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Este es el sistema de gestión. Utilice el menú superior para navegar.
        </p>
      </main>
    </div>
  )
}

