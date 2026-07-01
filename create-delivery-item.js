const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Criando item de delivery...');
    const item = await prisma.menuItem.create({
      data: {
        name: 'Moqueca de Camarão - Delivery',
        description: 'Deliciosa moqueca de camarão com coconut milk, pronta para delivery',
        price: 45.90,
        is_active: true,
        is_delivery: true,
        categoryId: 'cmr1eragd0002asvte61hm59u',
      }
    });
    console.log('✓ Item criado:', item.name);
    console.log('  ID:', item.id);
    console.log('  Preço: R$', item.price);
    console.log('  Is Delivery:', item.is_delivery);
    
    // Listar todos os itens com delivery
    const deliveryItems = await prisma.menuItem.findMany({
      where: { is_delivery: true },
      select: { id: true, name: true, price: true, is_delivery: true }
    });
    
    console.log('\n✓ Items de delivery no banco:');
    deliveryItems.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name} (R$ ${item.price})`);
    });
    
  } catch (e) {
    console.error('✗ Erro:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
