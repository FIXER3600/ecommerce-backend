import { prisma } from '../config/prisma.js';

export async function getDashboard(userId) {
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: { products: true },
  });
  if (!seller) throw new Error('Seller not found');

  const totalRevenue = seller.products.reduce((sum, p) => sum + Number(p.price) * p.totalSold, 0);
  const totalSold = seller.products.reduce((sum, p) => sum + p.totalSold, 0);
  const totalProducts = await prisma.product.count();
  const bestSeller = await prisma.product.findFirst({
    orderBy: { totalSold: "desc" },
    select: { id: true, name: true, totalSold: true, price: true },
  });

  return {
    storeName: seller.storeName,
    totalRevenue,
    totalSold,
    products: seller.products,
    totalProducts,
    bestSeller,
  };
}

export async function deactivateSeller(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}
