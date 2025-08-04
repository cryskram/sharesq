import { prisma } from "./prisma";

function generateCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateUniqueInviteCode() {
  let code;
  let exists = true;

  while (exists) {
    code = generateCode(8);
    const existingGroup = await prisma.group.findUnique({
      where: { inviteCode: code },
    });
    exists = !!existingGroup;
  }

  return code;
}
