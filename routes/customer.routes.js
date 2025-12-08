import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";
import { addFavoriteController,listFavoritesController, removeFavoriteController } from "../controllers/customer.controller.js";

const customerRoutes = Router();
customerRoutes.post('/favorites', requireAuth, requireRole('CLIENT'), addFavoriteController);
customerRoutes.get('/favorites', requireAuth, requireRole('CLIENT'), listFavoritesController);
customerRoutes.delete('/favorites/:productId', requireAuth, requireRole('CLIENT'), removeFavoriteController);
export default customerRoutes;
