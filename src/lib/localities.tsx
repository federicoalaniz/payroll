export interface LocalityData {
  [province: string]: string[];
}

export const localities: LocalityData = {
  "Buenos Aires": ["La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes", "Morón", "San Isidro"],
  "Ciudad Autónoma de Buenos Aires": ["Buenos Aires"],
  "Catamarca": ["San Fernando del Valle de Catamarca", "Santa María", "Andalgalá"],
  "Chaco": ["Resistencia", "Barranqueras", "Presidencia Roque Sáenz Peña"],
  "Chubut": ["Rawson", "Trelew", "Puerto Madryn", "Comodoro Rivadavia"],
  "Córdoba": ["Córdoba", "Villa María", "Río Cuarto", "San Francisco"],
  "Corrientes": ["Corrientes", "Goya", "Mercedes", "Curuzú Cuatiá"],
  "Entre Ríos": ["Paraná", "Concordia", "Gualeguaychú", "Concepción del Uruguay"],
  "Formosa": ["Formosa", "Clorinda", "Pirané"],
  "Jujuy": ["San Salvador de Jujuy", "Palpalá", "San Pedro", "Libertador General San Martín"],
  "La Pampa": ["Santa Rosa", "General Pico", "Toay"],
  "La Rioja": ["La Rioja", "Chilecito", "Chamical"],
  "Mendoza": ["Mendoza", "San Rafael", "Godoy Cruz", "Guaymallén"],
  "Misiones": ["Posadas", "Oberá", "Eldorado", "Puerto Iguazú"],
  "Neuquén": ["Neuquén", "Cutral Có", "Zapala", "San Martín de los Andes"],
  "Río Negro": ["Viedma", "General Roca", "San Carlos de Bariloche", "Cipolletti"],
  "Salta": ["Salta", "San Ramón de la Nueva Orán", "Tartagal", "Cafayate"],
  "San Juan": ["San Juan", "Rawson", "Rivadavia", "Chimbas"],
  "San Luis": ["San Luis", "Villa Mercedes", "Merlo"],
  "Santa Cruz": ["Río Gallegos", "Caleta Olivia", "El Calafate"],
  "Santa Fe": ["Santa Fe", "Rosario", "Venado Tuerto", "Rafaela"],
  "Santiago del Estero": ["Santiago del Estero", "La Banda", "Termas de Río Hondo"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande", "Tolhuin"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena", "Tafí Viejo", "Banda del Río Salí"]
};