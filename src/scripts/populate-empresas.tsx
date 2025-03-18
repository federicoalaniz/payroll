"use client";

import { useEffect } from 'react';
import { usePersonas } from '@/contexts/PersonasContext';

export function PopulateEmpresas() {
  const { addEmpresa } = usePersonas();

  useEffect(() => {
    const sampleEmpresas = [
      {
        id: crypto.randomUUID(),
        nombre: 'TechSolutions SA',
        razonSocial: 'TechSolutions Sociedad Anónima',
        cuit: '30-71234567-9',
        telefono: '011-4567-8900',
        email: 'contacto@techsolutions.com',
        domicilio: {
          calle: 'Av. Corrientes',
          numero: '1234',
          piso: '10',
          depto: 'A',
          localidad: 'Ciudad Autónoma de Buenos Aires',
          provincia: 'Buenos Aires'
        },
        descripcion: 'Empresa líder en soluciones tecnológicas'
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Constructora del Sur SRL',
        razonSocial: 'Constructora del Sur SRL',
        cuit: '30-65432198-7',
        telefono: '0351-422-3344',
        email: 'info@constructoradelsur.com',
        domicilio: {
          calle: 'San Martín',
          numero: '567',
          localidad: 'Córdoba',
          provincia: 'Córdoba'
        },
        descripcion: 'Empresa constructora con más de 20 años de experiencia'
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Industrias Metalúrgicas del Norte',
        razonSocial: 'Industrias Metalúrgicas del Norte SA',
        cuit: '30-89012345-6',
        telefono: '0341-456-7890',
        email: 'ventas@metalurgicasnorte.com',
        domicilio: {
          calle: 'Av. Industrial',
          numero: '789',
          localidad: 'Rosario',
          provincia: 'Santa Fe'
        },
        descripcion: 'Fabricación de productos metalúrgicos de alta calidad'
      }
    ];

    sampleEmpresas.forEach(empresa => {
      addEmpresa(empresa);
    });
  }, [addEmpresa]);

  return null;
}