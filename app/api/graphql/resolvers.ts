import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

export const resolvers = {
  Query: {
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

    addExpense: async (
      _: any,
      {
        groupId,
        title,
        amount,
      }: { groupId: string; title: string; amount: number }
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
          group: { connect: { id: groupId } },
          paidBy: { connect: { id: session.user.id } },
        },
      });

      return expense;
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
