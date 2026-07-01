const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Criando item de delivery...');
    
    // Criar um item de delivery
    const item = await prisma.menuItem.create({
      data: {
        name: 'Hambúrguer Delivery Premium',
        description: 'Hambúrguer gourmet delicioso pronto para delivery',
        price: 34.90,
        categoryId: 'cmr1eragd0002asvte61hm59u',
        is_active: true,
        is_delivery: true
      }
    });
    
    console.log('✓ Item criado com sucesso!');
    console.log('ID:', item.id);
    console.log('Nome:', item.name);
    console.log('Is Delivery:', item.is_delivery);
    
    // Listar todos os itens com is_delivery = true
    const deliveryItems = await prisma.menuItem.findMany({
      where: { is_delivery: true }
    });
    
    console.log('\n✓ Items de delivery encontrados:', deliveryItems.length);
    deliveryItems.forEach(item => {
      console.log(`  - ${item.name} (R$ ${item.price})`);
    });
    
  } catch (error) {
    console.error('✗ Erro:', error.message);
    if (error.code) console.error('  Código:', error.code);
  } finally {
    await prisma.$disconnect();
  }
})();
