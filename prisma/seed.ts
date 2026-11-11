import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const bahan = await prisma.category.upsert({
    where: { name: "Bahan jok" }, update: {}, create: { name: "Bahan jok" },
  });
  const custom = await prisma.category.upsert({
    where: { name: "Jok custom" }, update: {}, create: { name: "Jok custom" },
  });

  const products = [
    ["Kulit jok biasa", 50000, "Bahan kulit jok polos untuk kebutuhan satu jok motor.", bahan.id, false],
    ["Kulit jok motif", 80000, "Kulit jok bermotif untuk tampilan motor yang lebih khas.", bahan.id, false],
    ["Busa", 100000, "Busa jok motor untuk menambah kenyamanan berkendara.", bahan.id, false],
    ["Fiber / tulangan jok", 120000, "Tulangan fiber sebagai dasar konstruksi jok motor.", bahan.id, false],
    ["Latex", 80000, "Lapisan latex untuk dukungan dan kenyamanan tambahan.", bahan.id, false],
    ["Satu set jok custom", 300000, "Jok motor custom yang dapat disesuaikan dengan bahan, warna, motif, tekstur, dan model jahitan pilihan Anda.", custom.id, true],
  ] as const;

  for (const [name, price, description, categoryId, requiresCustom] of products) {
    const existing = await prisma.product.findFirst({ where: { name } });
    if (!existing) await prisma.product.create({ data: { name, price, description, categoryId, requiresCustom, stock: 10 } });
  }

  const email = process.env.ADMIN_EMAIL || "admin@j2m.local";
  const password = process.env.ADMIN_PASSWORD || "AdminJ2M123!";
  await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: { name: "Admin J2M", email, password: await bcrypt.hash(password, 12), role: "admin" },
  });
}

main().finally(() => prisma.$disconnect());
