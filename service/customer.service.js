import { prisma } from '../config/prisma.js';

export async function addFavorite(userId, productId) {
  return prisma.favorite.create({ data: { userId, productId } });
}

export async function listFavorites(userId) {
  return prisma.favorite.findMany({ where: { userId }, include: { product: true } });
}

export async function removeFavorite(id) {
  const favorite = await prisma.favorite.findUnique({
    where: { id }, 
  });

  if (!favorite) return null;

  await prisma.favorite.delete({
    where: { id },
  });

  return true;
}


