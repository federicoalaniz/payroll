import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import empresasRouter from './routes/empresas';
import empleadosRouter from './routes/empleados';
import liquidacionesRouter from './routes/liquidaciones';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/empresas', empresasRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/liquidaciones', liquidacionesRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { prisma };