import { deactivateSeller, getDashboard } from "../service/seller.service.js";

export const getDashboardController = async (req, res, next) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ error: "sellerId é obrigatório" });
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

