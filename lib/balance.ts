import { prisma } from "./prisma";

export async function getSimplifiedBalancesForUser(userId: string) {
  const userGroups = await prisma.userGroup.findMany({
    where: { userId },
    select: { groupId: true },
  });

  const groupIds = userGroups.map((ug) => ug.groupId);

  let allBalances: {
    from: { id: string; name: string };
    to: { id: string; name: string };
    amount: number;
  }[] = [];

  for (const groupId of groupIds) {
    const splits = await prisma.split.findMany({
      where: {
        expense: {
          groupId,
        },
      },
      include: {
        user: true,
        expense: {
          include: {
            paidBy: true,
          },
        },
      },
    });

    const settlements = await prisma.settlement.findMany({
      where: {
        groupId,
      },
      include: {
        settledBy: true,
        settledTo: true,
      },
    });

    const balancesMap = new Map<string, number>();

    for (const split of splits) {
      const key = `${split.user.id}->${split.expense.paidBy.id}`;
      const value = balancesMap.get(key) || 0;
      balancesMap.set(key, value + split.amount);
    }

    for (const s of settlements) {
      const key = `${s.settledBy.id}->${s.settledTo.id}`;
      const value = balancesMap.get(key) || 0;
      balancesMap.set(key, value - s.amount);
    }

    for (const [key, amount] of balancesMap.entries()) {
      if (Math.abs(amount) < 0.01) continue;
      const [fromId, toId] = key.split("->");

      if (fromId === userId || toId === userId) {
        const fromUser =
          splits.find((s) => s.user.id === fromId)?.user ||
          settlements.find((s) => s.settledBy.id === fromId)?.settledBy;
        const toUser =
          splits.find((s) => s.expense.paidBy.id === toId)?.expense.paidBy ||
          settlements.find((s) => s.settledTo.id === toId)?.settledTo;

        if (!fromUser || !toUser) continue;

        allBalances.push({
          from: { id: fromUser.id, name: fromUser.name || "Unknown" },
          to: { id: toUser.id, name: toUser.name || "Unknown" },
          amount,
        });
      }
    }
  }

  return allBalances;
}
