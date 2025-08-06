const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();
async function main() {
  console.log("Clearing all data...");

  await prisma.activityLog.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.split.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.userGroup.deleteMany();
  await prisma.group.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("All data cleared!");
}

main()
  .catch((e) => {
    console.error("Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
