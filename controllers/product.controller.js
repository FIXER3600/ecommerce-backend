import { prisma } from "../config/prisma.js";
import { bulkUploadProducts, createProduct, deleteProduct, getProductById, searchProducts, updateProduct } from "../service/product.service.js";

export const createProductController = async (req, res, next) => {
  try {
    const seller = await prisma.sellerProfile.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(403).json({ message: 'Forbidden' });
    const product = await createProduct(seller.id, req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
};

export const searchProductsController = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sellerId, page = 1, pageSize = 20 } = req.query;
    const result = await searchProducts({ q, minPrice, maxPrice, sellerId, page: Number(page), pageSize: Number(pageSize) });
    res.json(result);
  } catch (err) { next(err); }
};


export const uploadProductsCsvController = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File required' });

    const count = await bulkUploadProducts(req.user.id, req.file.buffer);
    res.status(201).json({ message: 'CSV processed', count });
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    next(err);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(String(productId));
    res.json(product);
  } catch (err) {
    if (err.message === 'Product not found') return res.status(404).json({ message: 'Product not found' });
    next(err);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const productId  = req.params.id;
    
    const soft = req.query.soft !== 'false';
    const result = await deleteProduct(req.user.id, String(productId), { soft });
    res.json({ message: soft ? 'Product hidden' : 'Product deleted', ...result });
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    if (err.message === 'Product not found') return res.status(404).json({ message: 'Product not found' });
    next(err);
  }
};
export const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const updated = await updateProduct(req.user.id, String(id), req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    if (err.message === 'Product not found') return res.status(404).json({ message: 'Product not found' });
    next(err);
  }
};

