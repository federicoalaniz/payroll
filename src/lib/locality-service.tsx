
const API_BASE_URL = "https://apis.datos.gob.ar/georef/api"

export interface LocalityResponse {
  localidades: Array<{
    nombre: string
    id: string
    provincia: {
      nombre: string
    }
  }>
}

export async function fetchLocalitiesByProvince(province: string): Promise<Array<{ id: string; nombre: string }>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/localidades?provincia=${encodeURIComponent(province)}&max=1000&campos=id,nombre,provincia.nombre`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: LocalityResponse = await response.json()
    return data.localidades
      .map(loc => ({ 
        id: `${loc.nombre}-${loc.id}`,
        nombre: loc.nombre 
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  } catch (error) {
    console.error('Error fetching localities:', error)
    return []
  }
}

export async function searchLocalities(query: string, province: string): Promise<Array<{ id: string; nombre: string }>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/localidades?nombre=${encodeURIComponent(query)}&provincia=${encodeURIComponent(province)}&max=10&campos=id,nombre`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: LocalityResponse = await response.json()
    return data.localidades
      .map(loc => ({ 
        id: `${loc.nombre}-${loc.id}`,
        nombre: loc.nombre 
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  } catch (error) {
    console.error('Error searching localities:', error)
    return []
  }
}