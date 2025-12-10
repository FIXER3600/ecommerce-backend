import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signUp(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      role: data.role,
      sellerProfile:
        data.role === "SELLER"
          ? { create: { storeName: data.storeName || "Minha Loja" } }
          : undefined,
      customerProfile: data.role === "CLIENT" ? { create: {} } : undefined,
    },
    include: {
      sellerProfile: true,
    },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    role: user.role,
    sellerId: user.role === "SELLER" ? user.sellerProfile?.id : null,
  };
}


export async function signIn(data) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { sellerProfile: true },
  });

  if (!user || !user.isActive || user.deletedAt) {
    throw new Error("Invalid credentials");
  }

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    role: user.role,
    sellerId: user.role === "SELLER" ? user.sellerProfile?.id : null,
  };
}


import { prisma } from '../config/prisma.js';

export async function deleteClientAccount(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { customerProfile: true, sellerProfile: true },
  });

  if (!user) throw new Error('User not found');
  if (user.role !== 'CLIENT') throw new Error('Forbidden');

  await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  await prisma.cart.deleteMany({ where: { userId } });
  await prisma.favorite.deleteMany({ where: { userId } });

  return { success: true };
}

export async function deactivateSellerAccount(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { sellerProfile: true },
  });

  if (!user) throw new Error('User not found');
  if (user.role !== 'SELLER') throw new Error('Forbidden');

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await prisma.product.updateMany({
    where: { sellerId: user.sellerProfile.id },
    data: { isHidden: true },
  });

  return { success: true };
}


