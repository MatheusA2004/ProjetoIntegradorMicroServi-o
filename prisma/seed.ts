import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@admin.com";
  const exists = await prisma.usuario.findUnique({ where: { email } });
  if (exists) {
    console.log("Admin já existe.");
    return;
  }

  await prisma.usuario.create({
    data: {
      nome: "Administrador",
      cpf: "00000000000",
      email,
      senha: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  console.log("Admin criado: admin@admin.com / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());