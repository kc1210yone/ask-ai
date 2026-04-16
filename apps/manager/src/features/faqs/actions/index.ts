'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { FaqFormSchema, type FaqActionState } from '../types';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const createFaq = async (
  projectId: string,
  _prevState: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> => {
  const parsed = FaqFormSchema.safeParse({
    question: formData.get('question'),
    answer: formData.get('answer'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};

export const updateFaq = async (
  projectId: string,
  faqId: string,
  _prevState: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> => {
  const parsed = FaqFormSchema.safeParse({
    question: formData.get('question'),
    answer: formData.get('answer'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.faq.update({
    where: { id: faqId },
    data: { question: parsed.data.question, answer: parsed.data.answer },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};

export const deleteFaq = async (
  projectId: string,
  faqId: string,
): Promise<void> => {
  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.faq.delete({ where: { id: faqId } });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};
