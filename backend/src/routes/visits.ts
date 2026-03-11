import express from 'express';
import { PrismaClient, VisitOutcome } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const createVisitSchema = z.object({
  leadId: z.string(),
  propertyName: z.string().min(2),
  visitDate: z.string().datetime(),
  visitTime: z.string(),
});

const updateVisitSchema = z.object({
  outcome: z.nativeEnum(VisitOutcome).optional(),
  notes: z.string().optional(),
});

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { leadId, propertyName, visitDate, visitTime } = createVisitSchema.parse(req.body);

    const visit = await prisma.visit.create({
      data: {
        leadId,
        agentId: req.user!.userId,
        propertyName,
        visitDate: new Date(visitDate),
        visitTime,
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'VISIT_SCHEDULED' },
    });

    await prisma.leadActivity.create({
      data: {
        leadId,
        agentId: req.user!.userId,
        type: 'VISIT',
        notes: `Visit scheduled for ${propertyName} on ${visitDate} at ${visitTime}`,
      },
    });

    res.status(201).json(visit);
  } catch (error) {
    console.error('Create visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, date, agentId, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (agentId) where.agentId = agentId;
    if (date) {
      const targetDate = new Date(date as string);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      where.visitDate = {
        gte: targetDate,
        lt: nextDate,
      };
    }

    const visits = await prisma.visit.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            phone: true,
            status: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        visitDate: 'asc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.visit.count({ where });

    res.json({
      visits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get visits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { outcome, notes } = updateVisitSchema.parse(req.body);

    const visit = await prisma.visit.update({
      where: { id },
      data: { outcome, notes },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (outcome) {
      await prisma.leadActivity.create({
        data: {
          leadId: visit.leadId,
          agentId: req.user!.userId,
          type: 'VISIT',
          notes: `Visit outcome: ${outcome}${notes ? `. Notes: ${notes}` : ''}`,
        },
      });

      if (outcome === 'BOOKED') {
        await prisma.lead.update({
          where: { id: visit.leadId },
          data: { status: 'BOOKED' },
        });
      } else if (outcome === 'NOT_INTERESTED') {
        await prisma.lead.update({
          where: { id: visit.leadId },
          data: { status: 'LOST' },
        });
      }
    }

    res.json(visit);
  } catch (error) {
    console.error('Update visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
