import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const db = new PrismaClient();

async function main() {
  const user = (process.env.SEED_ADMIN_USER ?? "ADMIN").trim().toUpperCase();
  const clave = process.env.SEED_ADMIN_CLAVE;
  if (!clave || clave.length < 12) {
    throw new Error("Define SEED_ADMIN_CLAVE en .env (mínimo 12 caracteres).");
  }

  await db.usuario.upsert({
    where: { username: user },
    update: {},
    create: {
      username: user,
      passwordHash: await argon2.hash(clave, { type: argon2.argon2id }),
      rol: "ADMIN",
      debeCambiarClave: true,
    },
  });

  const ajustes: Record<string, string> = {
    montoMensualidad: "25.00",
    mision:
      "Fortalecer la profesión de auditoría en el departamento de Oruro, promoviendo la ética, la calidad y la excelencia en el ejercicio profesional, contribuyendo al desarrollo económico y social de nuestra región y del país.",
    vision:
      "Ser un referente nacional en la formación, regulación y desarrollo de la profesión de auditoría, reconocido por su liderazgo, integridad y aporte al progreso de la sociedad.",
  };
  for (const [clave2, valor] of Object.entries(ajustes)) {
    await db.ajuste.upsert({ where: { clave: clave2 }, update: {}, create: { clave: clave2, valor } });
  }

  for (const tipo of ["DIRECTORIO", "TRIBUNAL_HONOR", "CONSEJO_TECNICO"] as const) {
    await db.organo.upsert({ where: { tipo }, update: {}, create: { tipo } });
  }
  for (const tipo of ["MENSUALIDADES", "TIENDA"] as const) {
    await db.configQr.upsert({ where: { tipo }, update: {}, create: { tipo } });
  }
  console.log("Seed listo. Cambia la clave del administrador en el primer ingreso.");
}

main().finally(() => db.$disconnect());
