const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: "Ashwin Kumar",
      email: "ashwin1@example.com",
      username: "ashwink1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Vageesh GN",
      email: "vageeshgn20051@gmail.com",
      username: "vageesh1",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Ritika Sharma",
      email: "ritika@example.com",
      username: "ritika1",
    },
  });

  const group = await prisma.group.create({
    data: {
      name: "Trip to Goa",
      inviteCode: "GOA123",
    },
  });

  await prisma.userGroup.createMany({
    data: [
      { userId: user1.id, groupId: group.id },
      { userId: user2.id, groupId: group.id },
      { userId: user3.id, groupId: group.id },
    ],
  });

  const expense = await prisma.expense.create({
    data: {
      title: "Hotel Booking",
      amount: 6000,
      notes: "2 nights stay",
      paidById: user1.id,
      groupId: group.id,
    },
  });

  await prisma.split.createMany({
    data: [
      { userId: user1.id, expenseId: expense.id, amount: 2000 },
      { userId: user2.id, expenseId: expense.id, amount: 2000 },
      { userId: user3.id, expenseId: expense.id, amount: 2000 },
    ],
  });

  await prisma.settlement.create({
    data: {
      amount: 2000,
      settledById: user2.id,
      settledToId: user1.id,
      groupId: group.id,
      note: "Paid Ashwin for hotel",
    },
  });

  await prisma.activityLog.createMany({
    data: [
      {
        message: "Ashwin added an expense: Hotel Booking",
        userId: user1.id,
        groupId: group.id,
      },
      {
        message: "Ritika joined the group",
        userId: user3.id,
        groupId: group.id,
      },
    ],
  });

  console.log("Seeded DB successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
