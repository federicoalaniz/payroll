import express from 'express';
import { prisma } from '..';

const router = express.Router();

// Get all empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        domicilio: true,
        empresa: true,
        liquidaciones: true
      }
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching empleados' });
  }
});

// Get empleado by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: {
        domicilio: true,
        empresa: true,
        liquidaciones: true
      }
    });
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado not found' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching empleado' });
  }
});

// Create empleado
router.post('/', async (req, res) => {
  try {
    const { nombre, cuil, dni, domicilio, categoria, subCategoria, fechaIngreso, empresaId } = req.body;
    const empleado = await prisma.empleado.create({
      data: {
        nombre,
        cuil,
        dni,
        categoria,
        subCategoria,
        fechaIngreso,
        empresaId,
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
        domicilio: true,
        empresa: true
      }
    });
    res.status(201).json(empleado);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'CUIL or DNI already exists' });
    }
    res.status(500).json({ error: 'Error creating empleado' });
  }
});

// Update empleado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuil, dni, domicilio, categoria, subCategoria, fechaIngreso, empresaId } = req.body;

    const empleado = await prisma.empleado.update({
      where: { id },
      data: {
        nombre,
        cuil,
        dni,
        categoria,
        subCategoria,
        fechaIngreso,
        empresaId,
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
        domicilio: true,
        empresa: true
      }
    });
    res.json(empleado);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'CUIL or DNI already exists' });
    }
    res.status(500).json({ error: 'Error updating empleado' });
  }
});

// Delete empleado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.empleado.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting empleado' });
  }
});

export default router;