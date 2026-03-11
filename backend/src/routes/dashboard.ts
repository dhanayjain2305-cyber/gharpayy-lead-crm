import express from 'express';
import { PrismaClient, LeadStatus } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      newLeadsToday,
      visitsScheduled,
      bookingsConfirmed,
      totalVisits,
      leadsByStatus,
      leadsBySource,
      agentPerformance,
      recentLeads,
      upcomingVisits
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: startOfDay,
          },
        },
      }),
      prisma.lead.count({
        where: {
          status: LeadStatus.BOOKED,
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.visit.count(),
      prisma.lead.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),
      prisma.lead.groupBy({
        by: ['source'],
        _count: {
          source: true,
        },
      }),
      prisma.user.findMany({
        where: {
          role: 'AGENT',
        },
        include: {
          _count: {
            select: {
              leads: true,
              visits: true,
            },
          },
        },
      }),
      prisma.lead.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          assignedAgent: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.visit.findMany({
        take: 10,
        where: {
          visitDate: {
            gte: startOfDay,
          },
        },
        orderBy: {
          visitDate: 'asc',
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
      }),
    ]);

    const conversionRate = totalLeads > 0 ? (bookingsConfirmed / totalLeads) * 100 : 0;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const leadsLast30Days = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: last30Days,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const leadsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      leadsByDay[dateStr] = 0;
    }

    leadsLast30Days.forEach(lead => {
      const dateStr = lead.createdAt.toISOString().split('T')[0];
      if (leadsByDay.hasOwnProperty(dateStr)) {
        leadsByDay[dateStr]++;
      }
    });

    res.json({
      overview: {
        totalLeads,
        newLeadsToday,
        visitsScheduled,
        bookingsConfirmed,
        conversionRate: Number(conversionRate.toFixed(2)),
      },
      charts: {
        leadsByStatus: leadsByStatus.map(item => ({
          status: item.status,
          count: item._count.status,
        })),
        leadsBySource: leadsBySource.map(item => ({
          source: item.source,
          count: item._count.source,
        })),
        leadsByDay: Object.entries(leadsByDay).map(([date, count]) => ({
          date,
          count,
        })),
      },
      agentPerformance: agentPerformance.map(agent => ({
        id: agent.id,
        name: agent.name,
        leadsAssigned: agent._count.leads,
        visitsScheduled: agent._count.visits,
        bookingsClosed: 0, // TODO: Calculate actual bookings
        conversionRate: 0, // TODO: Calculate actual conversion rate
      })),
      recentLeads,
      upcomingVisits,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: 'AGENT',
      },
      include: {
        leads: {
          include: {
            visits: true,
          },
        },
        visits: true,
      },
    });

    const leaderboard = agents.map(agent => {
      const totalLeads = agent.leads.length;
      const visitsScheduled = agent.visits.length;
      const bookings = agent.leads.filter(lead => lead.status === LeadStatus.BOOKED).length;
      const conversionRate = totalLeads > 0 ? (bookings / totalLeads) * 100 : 0;

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        leadsAssigned: totalLeads,
        visitsScheduled,
        bookingsClosed: bookings,
        conversionRate: Number(conversionRate.toFixed(2)),
      };
    });

    leaderboard.sort((a, b) => b.bookingsClosed - a.bookingsClosed);

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
