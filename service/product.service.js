import { prisma } from "../config/prisma.js";
import { parseCsv } from "../utils/csvParser.js";

export async function createProduct(sellerId, data) {
  return prisma.product.create({
    data: { ...data, sellerId, publishedAt: new Date(), isHidden: false }
  });
}
export async function searchProducts({ query, minPrice, maxPrice, sellerId, page, pageSize, userId }) {
  const where = {
    isHidden: false,
    OR: query ? [{ name: { contains: query } }, { description: { contains: query } }] : undefined,
    sellerId: sellerId || undefined,
  };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
      include: {
        favorites: {
          where: { userId }, 
          select: { id: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const itemsWithFav = items.map((product) => ({
    ...product,
    isFavorited: product.favorites.length > 0,
  }));

  return {
    items: itemsWithFav,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}


export async function bulkUploadProducts(userId, fileBuffer) {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) throw new Error('Forbidden');

  const rows = await parseCsv(fileBuffer);
  const batchSize = 500;
  let created = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    await prisma.product.createMany({
      data: chunk.map((row) => ({
        sellerId: seller.id,
        name: String(row.name),
        price: Number(row.price),
        description: String(row.description ?? ''),
        imageUrl: String(row.imageUrl ?? ''),
        publishedAt: row.publishedAt ? new Date(row.publishedAt) : new Date(),
        isHidden: false,
      })),
      skipDuplicates: true,
    });
    created += chunk.length;
  }

  return created;
}

export async function getProductById(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: { select: { id: true, storeName: true } },
      favorites: false,      
      orderItems: false,
    },
  });
  if (!product) throw new Error('Product not found');

  const favoritesCount = await prisma.favorite.count({ where: { productId } });
  const soldCount = await prisma.orderItem.aggregate({
    where: { productId },
    _sum: { quantity: true },
  });

  return {
    ...product,
    favoritesCount,
    totalSold: soldCount._sum.quantity || 0,
  };
}

export async function deleteProduct(userId, productId, { soft = true } = {}) {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) throw new Error('Forbidden');

  const product = await prisma.product.findUnique({ where: { id: productId } });
  
  if (!product) throw new Error('Product not found');
  if (product.sellerId !== seller.id) throw new Error('Forbidden');

  if (soft) {
    await prisma.product.update({
      where: { id: productId },
      data: { isHidden: true },
    });
    return { success: true, softDeleted: true };
  }

  await prisma.cartItem.deleteMany({ where: { productId } });
  await prisma.favorite.deleteMany({ where: { productId } });
  await prisma.orderItem.deleteMany({ where: { productId } }); 
  await prisma.product.delete({ where: { id: productId } });

  return { success: true, softDeleted: false };
}

export async function updateProduct(userId, productId, data) {
  const seller = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!seller) throw new Error('Forbidden');
  const product = await prisma.product.findUnique({ where: { id: productId } });
  
  if (!product) throw new Error('Product not found');
  if (product.sellerId !== seller.id) throw new Error('Forbidden');

  const updateData = {};
  if (data.name !== undefined) updateData.name = String(data.name);
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.description !== undefined) updateData.description = String(data.description);
  if (data.imageUrl !== undefined) updateData.imageUrl = String(data.imageUrl);
  if (data.isHidden !== undefined) updateData.isHidden = Boolean(data.isHidden);
  if (data.publishedAt !== undefined) updateData.publishedAt = new Date(data.publishedAt);

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
  });
}
