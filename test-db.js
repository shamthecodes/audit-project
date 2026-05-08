import { prisma } from "./lib/prisma.js";

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");

    const count = await prisma.audit.count();
    console.log(`✅ Audit table exists — ${count} records`);
  } catch (error) {
    console.error("❌ Prisma connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
