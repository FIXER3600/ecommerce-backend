import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { addItemController, clearCartController, getCartController, removeFromCartController } from "../controllers/cart.controller.js";
import { requireRole } from "../middlewares/roles.js";

const cartRoutes = Router();
cartRoutes.get('/', requireAuth, requireRole('CLIENT'), getCartController);
cartRoutes.post('/items', requireAuth, requireRole('CLIENT'), addItemController);
cartRoutes.delete('/items/:productId', requireAuth, requireRole('CLIENT'), removeFromCartController);
cartRoutes.delete('/clear', requireAuth, requireRole('CLIENT'), clearCartController);
export default cartRoutes;
