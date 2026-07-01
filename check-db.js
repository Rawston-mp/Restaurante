const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // Verificar os últimos 3 pratos criados
    const items = await prisma.menuItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, sectionId: true, categoryId: true },
    });
    
    console.log('Últimos 3 pratos criados:');
    items.forEach(item => {
      console.log(`  - ${item.name}: sectionId=${item.sectionId}, categoryId=${item.categoryId}`);
    });
    
    // Verificar a seção "Saladas"
    const saladSection = await prisma.dailyMenuSection.findFirst({
      where: { name: "Saladas" },
      include: {
        items: {
          select: { id: true, name: true, is_active: true },
        },
      },
    });
    
    console.log('\nSeção "Saladas":');
    console.log(`  ID: ${saladSection?.id}`);
    console.log(`  Items: ${saladSection?.items.length ?? 0}`);
    saladSection?.items.forEach(item => {
      console.log(`    - ${item.name} (is_active: ${item.is_active})`);
    });
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
