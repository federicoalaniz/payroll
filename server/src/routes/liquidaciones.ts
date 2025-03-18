import express from 'express';
import { prisma } from '..';

const router = express.Router();

// Get all liquidaciones
router.get('/', async (req, res) => {
  try {
    const liquidaciones = await prisma.liquidacion.findMany({
      include: {
        empleado: true,
        items: true,
        deducciones: true
      }
    });
    res.json(liquidaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching liquidaciones' });
  }
});

// Get liquidaciones by empleado ID
router.get('/empleado/:empleadoId', async (req, res) => {
  try {
    const { empleadoId } = req.params;
    const liquidaciones = await prisma.liquidacion.findMany({
      where: { empleadoId },
      include: {
        items: true,
        deducciones: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(liquidaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching liquidaciones' });
  }
});

// Get liquidacion by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const liquidacion = await prisma.liquidacion.findUnique({
      where: { id },
      include: {
        empleado: true,
        items: true,
        deducciones: true
      }
    });
    if (!liquidacion) {
      return res.status(404).json({ error: 'Liquidacion not found' });
    }
    res.json(liquidacion);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching liquidacion' });
  }
});

// Create liquidacion
router.post('/', async (req, res) => {
  try {
    const {
      empleadoId,
      fecha,
      periodo,
      basicSalary,
      presentismoPercentage,
      totalRemunerativo,
      totalNoRemunerativo,
      totalDeducciones,
      totalNeto,
      items,
      deducciones
    } = req.body;

    const liquidacion = await prisma.liquidacion.create({
      data: {
        empleadoId,
        fecha,
        periodo,
        basicSalary,
        presentismoPercentage,
        totalRemunerativo,
        totalNoRemunerativo,
        totalDeducciones,
        totalNeto,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            percentage: item.percentage,
            amount: item.amount,
            isRemunerative: item.isRemunerative,
            isAttendanceRow: item.isAttendanceRow || false,
            isSeniorityRow: item.isSeniorityRow || false,
            referenceItemId: item.referenceItemId
          }))
        },
        deducciones: {
          create: deducciones.map((deduccion: any) => ({
            name: deduccion.name,
            percentage: deduccion.percentage,
            checkedRemunerative: deduccion.checkedRemunerative,
            checkedNonRemunerative: deduccion.checkedNonRemunerative
          }))
        }
      },
      include: {
        items: true,
        deducciones: true
      }
    });
    res.status(201).json(liquidacion);
  } catch (error) {
    console.error('Error creating liquidacion:', error);
    res.status(500).json({ error: 'Error creating liquidacion' });
  }
});

// Update liquidacion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      periodo,
      basicSalary,
      presentismoPercentage,
      totalRemunerativo,
      totalNoRemunerativo,
      totalDeducciones,
      totalNeto,
      items,
      deducciones
    } = req.body;

    // Delete existing items and deducciones
    await prisma.liquidacionItem.deleteMany({
      where: { liquidacionId: id }
    });
    await prisma.deduccion.deleteMany({
      where: { liquidacionId: id }
    });

    const liquidacion = await prisma.liquidacion.update({
      where: { id },
      data: {
        fecha,
        periodo,
        basicSalary,
        presentismoPercentage,
        totalRemunerativo,
        totalNoRemunerativo,
        totalDeducciones,
        totalNeto,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            percentage: item.percentage,
            amount: item.amount,
            isRemunerative: item.isRemunerative,
            isAttendanceRow: item.isAttendanceRow || false,
            isSeniorityRow: item.isSeniorityRow || false,
            referenceItemId: item.referenceItemId
          }))
        },
        deducciones: {
          create: deducciones.map((deduccion: any) => ({
            name: deduccion.name,
            percentage: deduccion.percentage,
            checkedRemunerative: deduccion.checkedRemunerative,
            checkedNonRemunerative: deduccion.checkedNonRemunerative
          }))
        }
      },
      include: {
        items: true,
        deducciones: true
      }
    });
    res.json(liquidacion);
  } catch (error) {
    console.error('Error updating liquidacion:', error);
    res.status(500).json({ error: 'Error updating liquidacion' });
  }
});

// Delete liquidacion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.liquidacion.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting liquidacion' });
  }
});

export default router;