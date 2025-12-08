import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import sellerRoutes from './routes/seller.routes.js';
import productRoutes from './routes/product.routes.js';
import customerRoutes from './routes/customer.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/seller', sellerRoutes);
app.use('/customer', customerRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);

export default app;

