import { Router } from "express";
import { requireRole } from "../middlewares/roles.js";
import { requireAuth } from "../middlewares/auth.js";
import { createProductController, deleteProductController, getProductByIdController, searchProductsController, updateProductController, uploadProductsCsvController } from "../controllers/product.controller.js";
import { uploadCsv } from "../middlewares/upload.js";

const productRoutes = Router();
productRoutes.get('/', searchProductsController);
productRoutes.get('/:productId', requireAuth, getProductByIdController);
productRoutes.post('/', requireAuth, requireRole('SELLER'), createProductController);
productRoutes.put('/:id', requireAuth, requireRole('SELLER'), updateProductController);
productRoutes.delete('/:id', requireAuth, requireRole('SELLER'), deleteProductController);
productRoutes.post('/upload-csv', requireAuth, requireRole('SELLER'), uploadCsv, uploadProductsCsvController);
export default productRoutes;
