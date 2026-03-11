import express from 'express';
import { PrismaClient, LeadSource, LeadStatus } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { assignLeadToAgent } from '../services/leadAssignment';
import '../types';

const router = express.Router();
const prisma = new PrismaClient();

const createLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  source: z.nativeEnum(LeadSource),
});

const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, source } = createLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        source,
        status: LeadStatus.NEW_LEAD,
      },
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const assignedLead = await assignLeadToAgent(prisma, lead.id);

    res.status(201).json(assignedLead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, source, assignedAgentId, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (assignedAgentId) where.assignedAgentId = assignedAgentId;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            visits: true,
            leadActivities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.lead.count({ where });

    res.json({
      leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        visits: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        leadActivities: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = updateLeadStatusSchema.parse(req.body);

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        assignedAgent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: id,
        agentId: req.user!.userId,
        type: 'STATUS_CHANGE',
        notes: `Status changed to ${status}`,
      },
    });

    res.json(lead);
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, notes } = req.body;

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: id,
        agentId: req.user!.userId,
        type,
        notes,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
