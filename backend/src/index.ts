import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import visitRoutes from './routes/visits';
import dashboardRoutes from './routes/dashboard';
import { checkFollowUpReminders } from './services/followUpService';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://gharpayy-lead-crm.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

cron.schedule('0 9 * * *', async () => {
  console.log('Running follow-up reminder check...');
  await checkFollowUpReminders(prisma);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
