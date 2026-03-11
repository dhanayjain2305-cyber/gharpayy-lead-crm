import { PrismaClient, Lead, ActivityType } from '@prisma/client';

export async function checkFollowUpReminders(prisma: PrismaClient): Promise<void> {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const leadsNeedingFollowUp = await prisma.lead.findMany({
      where: {
        AND: [
          {
            updatedAt: {
              lt: twentyFourHoursAgo,
            },
          },
          {
            status: {
              notIn: ['BOOKED', 'LOST'],
            },
          },
        ],
      },
      include: {
        assignedAgent: true,
        leadActivities: {
          where: {
            type: ActivityType.FOLLOW_UP,
            createdAt: {
              gte: twentyFourHoursAgo,
            },
          },
        },
      },
    });

    for (const lead of leadsNeedingFollowUp) {
      if (lead.leadActivities.length === 0) {
        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            agentId: lead.assignedAgentId || '',
            type: ActivityType.FOLLOW_UP,
            notes: 'Automatic follow-up reminder: No activity in the last 24 hours',
          },
        });

        console.log(`Follow-up reminder created for lead: ${lead.name} (${lead.phone})`);
      }
    }

    console.log(`Processed ${leadsNeedingFollowUp.length} leads for follow-up reminders`);
  } catch (error) {
    console.error('Error checking follow-up reminders:', error);
  }
}
