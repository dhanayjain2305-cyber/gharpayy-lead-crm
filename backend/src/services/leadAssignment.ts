import { PrismaClient, User, Role } from '@prisma/client';

export async function assignLeadToAgent(prisma: PrismaClient, leadId: string): Promise<any> {
  const agents = await prisma.user.findMany({
    where: {
      role: Role.AGENT,
    },
    include: {
      _count: {
        select: {
          leads: true,
        },
      },
    },
  });

  if (agents.length === 0) {
    throw new Error('No agents available for assignment');
  }

  agents.sort((a, b) => a._count.leads - b._count.leads);

  const selectedAgent = agents[0];

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedAgentId: selectedAgent.id,
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

  return updatedLead;
}
