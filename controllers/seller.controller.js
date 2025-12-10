import { deactivateSeller, getDashboard } from "../service/seller.service.js";

export const getDashboardController = async (req, res, next) => {
  try {
    let sellerId = req.sellerId;
    if (!sellerId && req.userId) {
      const seller = await prisma.sellerProfile.findUnique({
        where: { userId: req.userId },
        select: { id: true },
      });
      sellerId = seller?.id;
    }

    if (!sellerId) {
      return res.status(403).json({ error: "Seller not found or not authorized" });
    }

    const dashboard = await getDashboard(sellerId);
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
};


export const deactivateSellerController = async (req, res, next) => {
  try {
    await deactivateSeller(req.user.id);
    res.json({ message: 'Seller account deactivated' });
  } catch (err) { next(err); }
};

