import type { Document, Faq, Project } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export type ProjectWithCounts = Project & {
  _count: { documents: number; faqs: number };
};

export type ProjectWithChildren = Project & {
  documents: Document[];
  faqs: Faq[];
};

export const getUserProjects = async (
  userId: string,
): Promise<ProjectWithCounts[]> => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { documents: true, faqs: true } } },
  });
};

export const getProject = async (
  projectId: string,
  userId: string,
): Promise<ProjectWithChildren | null> => {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      documents: { orderBy: { createdAt: 'desc' } },
      faqs: { orderBy: { createdAt: 'desc' } },
    },
  });
};
