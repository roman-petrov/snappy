/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable unicorn/no-null */

import type { PrismaClient } from "./generated/client";

export type AgentMessageRow = { content: unknown; hiddenFromFeed: boolean; id: string; role: string };

export const DbAgentSession = (prisma: PrismaClient) => {
  const create = async (userId: number) =>
    prisma.agentSession.create({ data: { presetId: null, userId }, select: { id: true } });

  const messagesForSession = async (sessionId: string) =>
    prisma.agentMessage.findMany({
      orderBy: { createdAt: `asc` },
      select: { content: true, hiddenFromFeed: true, id: true, role: true },
      where: { sessionId },
    });

  const appendMessage = async (sessionId: string, role: string, content: unknown, hiddenFromFeed = false) =>
    prisma.agentMessage.create({
      data: { content: content as object, hiddenFromFeed, role, sessionId },
      select: { id: true },
    });

  const touchSession = async (sessionId: string) =>
    prisma.agentSession.update({ data: { updatedAt: new Date() }, where: { id: sessionId } });

  const sessionForUser = async (sessionId: string, userId: number) =>
    prisma.agentSession.findFirst({ where: { id: sessionId, userId } });

  const listSessions = async (userId: number, take: number) =>
    prisma.agentSession.findMany({
      orderBy: { updatedAt: `desc` },
      select: { id: true, presetId: true, updatedAt: true },
      take,
      where: { userId },
    });

  return { appendMessage, create, listSessions, messagesForSession, sessionForUser, touchSession };
};
