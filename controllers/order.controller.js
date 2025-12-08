import { checkout, listOrders } from "../service/order.service.js";

export const checkoutController = async (req, res, next) => {
  try { res.status(201).json(await checkout(req.user.id)); }
  catch (err) { next(err); }
};

export const listOrdersController = async (req, res, next) => {
  try { res.json(await listOrders(req.user.id)); }
  catch (err) { next(err); }
};

