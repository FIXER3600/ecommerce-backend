import { Router } from "express";
import { deactivateSellerAccountController, deleteClientAccountController, signInController, signUpController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";

const authRoutes = Router();
authRoutes.post('/signup', signUpController);
authRoutes.post('/signin', signInController);
authRoutes.delete('/client', requireAuth, requireRole('CLIENT'), deleteClientAccountController);
authRoutes.put('/seller/deactivate', requireAuth, requireRole('SELLER'), deactivateSellerAccountController);
export default authRoutes;
