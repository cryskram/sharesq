import { auth } from "@/app/auth";
import { getSimplifiedBalancesForUser } from "@/lib/balance";
import { generateUniqueInviteCode } from "@/lib/invite";
import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
    myBalances: async () => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");
      const userId = session?.user?.id;

      return await getSimplifiedBalancesForUser(userId);
    },
    users: async () => {
      return await prisma.user.findMany();
    },
    me: async () => {
      const session = await auth();
      if (!session?.user?.email) return null;

      return prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          userGroups: {
            include: {
              group: true,
            },
          },
        },
      });
    },

    groups: async () => {
      const session = await auth();
      if (!session?.user?.id) return [];

      const userGroups = await prisma.userGroup.findMany({
        where: { userId: session.user.id },
        include: { group: true },
      });

      return userGroups.map((ug) => ug.group);
    },

    expenses: async (_: any, { groupId }: { groupId: string }) => {
      const session = await auth();
      if (!session?.user?.id) return [];

      const member = await prisma.userGroup.findFirst({
        where: {
          groupId,
          userId: session.user.id,
        },
      });

      if (!member) return [];

      return prisma.expense.findMany({
        where: { groupId },
        include: { paidBy: true, group: true },
        orderBy: { createdAt: "desc" },
      });
    },

    balances: async (_: any, { groupId }: { groupId: string }) => {
      const expenses = await prisma.expense.findMany({
        where: { groupId },
        include: {
          paidBy: true,
          splits: {
            include: {
              user: true,
            },
          },
        },
      });

      const balancesMap: Record<string, Record<string, number>> = {};

      for (const expense of expenses) {
        const payerId = expense.paidBy.id;
        const totalAmount = expense.amount;
        const splits = expense.splits;

        const shareAmount = totalAmount / splits.length;

        for (const split of splits) {
          const userId = split.user.id;

          if (userId === payerId) continue;

          if (!balancesMap[userId]) balancesMap[userId] = {};
          if (!balancesMap[userId][payerId]) balancesMap[userId][payerId] = 0;

          balancesMap[userId][payerId] += shareAmount;
        }
      }

      const settlements = await prisma.settlement.findMany({
        where: { groupId },
      });

      for (const s of settlements) {
        const fromId = s.settledById;
        const toId = s.settledToId;

        if (!balancesMap[fromId]) balancesMap[fromId] = {};
        if (!balancesMap[fromId][toId]) balancesMap[fromId][toId] = 0;

        balancesMap[fromId][toId] -= s.amount;
      }

      const result = [];

      for (const fromId in balancesMap) {
        for (const toId in balancesMap[fromId]) {
          const amount = balancesMap[fromId][toId];
          if (amount > 0.01) {
            const from = await prisma.user.findUnique({
              where: { id: fromId },
            });
            const to = await prisma.user.findUnique({ where: { id: toId } });

            if (from && to) {
              result.push({
                from,
                to,
                amount: Math.round(amount * 100) / 100,
              });
            }
          }
        }
      }

      return result;
    },

    activityLogs: async (_: any, { groupId }: { groupId: string }) => {
      return prisma.activityLog.findMany({
        where: { groupId },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
        },
      });
    },
  },

  Mutation: {
    createGroup: async (_: any, { name }: { name: string }) => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const group = await prisma.group.create({
        data: {
          name,
          userGroups: {
            create: {
              userId: session.user.id,
            },
          },
        },
      });

      return group;
    },

    createGroupWithMembers: async (
      _: any,
      { name, userIds }: { name: string; userIds: string[] }
    ) => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const inviteCode = await generateUniqueInviteCode();

      const group = await prisma.group.create({
        data: {
          name,
          inviteCode,
        },
      });

      const uniqueUserIds = Array.from(new Set([...userIds, session.user.id]));

      await prisma.userGroup.createMany({
        data: uniqueUserIds.map((id) => ({
          userId: id,
          groupId: group.id,
        })),
      });

      return group;
    },

    addExpense: async (
      _: any,
      {
        groupId,
        title,
        amount,
        notes,
        splitWith,
      }: {
        groupId: string;
        title: string;
        amount: number;
        notes?: string;
        splitWith: string[];
      }
    ) => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const isMember = await prisma.userGroup.findFirst({
        where: {
          userId: session.user.id,
          groupId,
        },
      });

      if (!isMember) throw new Error("Not a group member");

      const expense = await prisma.expense.create({
        data: {
          title,
          amount,
          notes,
          group: { connect: { id: groupId } },
          paidBy: { connect: { id: session.user.id } },
        },
      });

      const uniqueUserIds = Array.from(new Set(splitWith));
      const share = Number((amount / uniqueUserIds.length).toFixed(2));

      await prisma.split.createMany({
        data: uniqueUserIds.map((userId) => ({
          expenseId: expense.id,
          userId,
          amount: share,
        })),
      });

      await prisma.activityLog.create({
        data: {
          groupId,
          userId: session.user.id,
          message: `added an expense "${title}" of ₹${amount}`,
        },
      });

      return await prisma.expense.findUnique({
        where: { id: expense.id },
        include: { paidBy: true, group: true },
      });
    },

    settleUp: async (
      _: any,
      {
        groupId,
        toUserId,
        amount,
        note,
      }: {
        groupId: string;
        toUserId: string;
        amount: number;
        note?: string;
      }
    ) => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const [fromMember, toMember] = await Promise.all([
        prisma.userGroup.findFirst({
          where: { userId: session.user.id, groupId },
        }),
        prisma.userGroup.findFirst({ where: { userId: toUserId, groupId } }),
      ]);

      if (!fromMember || !toMember)
        throw new Error("Both users must be in the group");

      const settlement = await prisma.settlement.create({
        data: {
          amount,
          note,
          settledBy: { connect: { id: session.user.id } },
          settledTo: { connect: { id: toUserId } },
          group: { connect: { id: groupId } },
        },
        include: {
          settledBy: true,
          settledTo: true,
          group: true,
        },
      });

      await prisma.activityLog.create({
        data: {
          message: `${settlement.settledBy.name} settled ₹${amount} with ${settlement.settledTo.name}`,
          user: { connect: { id: session.user.id } },
          group: { connect: { id: groupId } },
        },
      });

      return settlement;
    },

    createActivityLog: async (
      _: any,
      { groupId, message }: { groupId: string; message: string }
    ) => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Unauthorized");

      return prisma.activityLog.create({
        data: {
          message,
          groupId,
          userId: session.user.id,
        },
        include: { user: true },
      });
    },
  },

  User: {
    groups: async (parent: any) => {
      const userGroups = await prisma.userGroup.findMany({
        where: { userId: parent.id },
        include: { group: true },
      });

      return userGroups.map((ug) => ug.group);
    },
  },

  Group: {
    members: async (parent: any) => {
      const userGroups = await prisma.userGroup.findMany({
        where: { groupId: parent.id },
        include: { user: true },
      });

      return userGroups.map((ug) => ug.user);
    },
  },
};
