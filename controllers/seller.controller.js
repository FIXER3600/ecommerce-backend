import { deactivateSeller, getDashboard } from "../service/seller.service.js";

export const getDashboardController = async (req, res, next) => {
  try {
    res.json(await getDashboard(req.user.id));
  } catch (err) { next(err); }
};

export const deactivateSellerController = async (req, res, next) => {
  try {
    await deactivateSeller(req.user.id);
    res.json({ message: 'Seller account deactivated' });
  } catch (err) { next(err); }
};

