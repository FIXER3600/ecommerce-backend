import { prisma } from "../config/prisma.js";

export async function getCart(userId) {
  return prisma.cart.findFirst({ where: { userId }, include: { items: { include: {
        product: true,
      },
} } });
}

export async function addItem(userId, productId, quantity) {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }
  return prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      price: product.price, 
    },
  });
}


export async function clearCart(userId) {
  const cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function removeFromCart(userId, productId) {
  const cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) throw new Error('Cart not found');

  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  if (!item) throw new Error('Item not found');

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  return { success: true };
}
