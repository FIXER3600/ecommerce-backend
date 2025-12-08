import { prisma } from '../config/prisma.js';

export async function checkout(userId) {
  const cart = await prisma.cart.findFirst({ where: { userId }, include: { items: true } });
  if (!cart || cart.items.length === 0) throw new Error('Cart empty');
  const total = cart.items.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: total,
      items: { create: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.price })) }
    },
    include: { items: true }
  });
    for (const item of cart.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        totalSold: { increment: item.quantity },
      },
    });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return order;
}

export async function listOrders(userId) {
  return prisma.order.findMany({ where: { userId }, include: { items: true } });
}
