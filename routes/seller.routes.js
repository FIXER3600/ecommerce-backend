import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";
import { getDashboardController } from "../controllers/seller.controller.js";
import { uploadProductsCsvController } from "../controllers/product.controller.js";

const sellerRoutes = Router();
sellerRoutes.post('/products/upload', requireAuth, requireRole('SELLER'), uploadProductsCsvController);
sellerRoutes.get('/dashboard', requireAuth, requireRole('SELLER'), getDashboardController);
export default sellerRoutes;
