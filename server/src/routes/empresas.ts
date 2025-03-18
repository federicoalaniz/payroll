import express from 'express';
import { prisma } from '..';

const router = express.Router();

// Get all empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany({
      include: {
        domicilio: true,
        empleados: true
      }
    });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching empresas' });
  }
});

// Get empresa by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        domicilio: true,
        empleados: true
      }
    });
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa not found' });
    }
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching empresa' });
  }
});

// Create empresa
router.post('/', async (req, res) => {
  try {
    const { nombre, razonSocial, cuit, domicilio, descripcion } = req.body;
    const empresa = await prisma.empresa.create({
      data: {
        nombre,
        razonSocial,
        cuit,
        descripcion,
        domicilio: domicilio ? {
          create: {
            calle: domicilio.calle,
            numero: domicilio.numero,
            piso: domicilio.piso,
            depto: domicilio.depto,
            ciudad: domicilio.localidad,
            provincia: domicilio.provincia
          }
        } : undefined
      },
      include: {
        domicilio: true
      }
    });
    res.status(201).json(empresa);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'CUIT already exists' });
    }
    res.status(500).json({ error: 'Error creating empresa' });
  }
});

// Update empresa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, razonSocial, cuit, domicilio, descripcion } = req.body;

    const empresa = await prisma.empresa.update({
      where: { id },
      data: {
        nombre,
        razonSocial,
        cuit,
        descripcion,
        domicilio: domicilio ? {
          upsert: {
            create: {
              calle: domicilio.calle,
              numero: domicilio.numero,
              piso: domicilio.piso,
              depto: domicilio.depto,
              ciudad: domicilio.localidad,
              provincia: domicilio.provincia
            },
            update: {
              calle: domicilio.calle,
              numero: domicilio.numero,
              piso: domicilio.piso,
              depto: domicilio.depto,
              ciudad: domicilio.localidad,
              provincia: domicilio.provincia
            }
          }
        } : undefined
      },
      include: {
        domicilio: true
      }
    });
    res.json(empresa);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'CUIT already exists' });
    }
    res.status(500).json({ error: 'Error updating empresa' });
  }
});

// Delete empresa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.empresa.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting empresa' });
  }
});

export default router;