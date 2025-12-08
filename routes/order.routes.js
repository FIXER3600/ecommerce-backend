import { Router } from "express";
import { requireRole } from "../middlewares/roles.js";
import { requireAuth } from "../middlewares/auth.js";
import { checkoutController, listOrdersController } from "../controllers/order.controller.js";

const orderRoutes = Router();
orderRoutes.post('/checkout', requireAuth, requireRole('CLIENT'), checkoutController);
orderRoutes.get('/', requireAuth, requireRole('CLIENT'), listOrdersController);
export default orderRoutes;
