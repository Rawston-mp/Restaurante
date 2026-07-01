import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Admin
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@restaurante.com" },
    update: {},
    create: {
      email: "admin@restaurante.com",
      password_hash: passwordHash,
    },
  });
  console.log("✅ Usuário admin criado: admin@restaurante.com / admin123");

  // Categorias
  const categorias = [
    { name: "Entradas", order: 1 },
    { name: "Pratos Principais", order: 2 },
    { name: "Sobremesas", order: 3 },
    { name: "Bebidas", order: 4 },
  ];
  for (const cat of categorias) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categorias criadas");

  const entrada = await prisma.category.findUnique({ where: { name: "Entradas" } });
  const principal = await prisma.category.findUnique({ where: { name: "Pratos Principais" } });
  const sobremesa = await prisma.category.findUnique({ where: { name: "Sobremesas" } });
  const bebida = await prisma.category.findUnique({ where: { name: "Bebidas" } });

  // Itens do cardápio
  const items = [
    { name: "Bruschetta ao Alho e Tomate", description: "Pão rústico tostado com tomate cereja, alho e azeite extra virgem.", price: 18.9, categoryId: entrada!.id },
    { name: "Carpaccio de Carne", description: "Finas fatias de carne bovina com alcaparras e molho especial.", price: 32.5, categoryId: entrada!.id },
    { name: "Frango Grelhado com Legumes", description: "Peito de frango grelhado acompanhado de legumes salteados.", price: 45.9, categoryId: principal!.id },
    { name: "Filé ao Molho Madeira", description: "Filé mignon ao ponto com molho madeira e batatas gratinadas.", price: 68.0, categoryId: principal!.id },
    { name: "Risoto de Camarão", description: "Arroz arbóreo cremoso com camarões frescos e toque de limão siciliano.", price: 72.0, categoryId: principal!.id },
    { name: "Petit Gateau", description: "Bolo quente de chocolate com sorvete de creme e calda.", price: 22.0, categoryId: sobremesa!.id },
    { name: "Pudim de Leite", description: "Pudim clássico com calda de caramelo.", price: 15.0, categoryId: sobremesa!.id },
    { name: "Suco Natural", description: "Laranja, limão, maracujá ou abacaxi (500ml).", price: 12.0, categoryId: bebida!.id },
    { name: "Refrigerante", description: "Lata 350ml – Coca-Cola, Guaraná ou Soda.", price: 7.5, categoryId: bebida!.id },
  ];

  for (const item of items) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }
  console.log("✅ Itens do cardápio criados");

  // Configurações
  const configs = [
    { key: "telefone", value: "(11) 3456-7890" },
    { key: "whatsapp", value: "(11) 9 9876-5432" },
    { key: "endereco", value: "Rua das Flores, 456 – Centro – São Paulo/SP" },
    { key: "horarios", value: "Ter–Sex: 11h–22h | Sáb: 11h–23h | Dom: 11h–21h | Seg: Fechado" },
    { key: "instagram", value: "@meurestaurante" },
    { key: "maps_url", value: "" },
  ];
  for (const cfg of configs) {
    await prisma.settings.upsert({
      where: { key: cfg.key },
      update: {},
      create: cfg,
    });
  }
  console.log("✅ Configurações do site criadas");

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("   Login admin: admin@restaurante.com");
  console.log("   Senha:       admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
