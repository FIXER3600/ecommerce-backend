import { addItem, clearCart, getCart, removeFromCart } from "../service/cart.service.js";

export const getCartController = async (req, res, next) => {
  try { res.json(await getCart(req.user.id)); }
  catch (err) { next(err); }
};

export const addItemController = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    res.status(201).json(await addItem(req.user.id, productId, quantity));
  } catch (err) { next(err); }
};

export const clearCartController = async (req, res, next) => {
  try { await clearCart(req.user.id); res.json({ message: 'Cart cleared' }); }
  catch (err) { next(err); }
};


export const removeFromCartController = async (req, res, next) => {
  try {
    const productId = req.params.productId || req.body.productId;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    await removeFromCart(req.user.id, String(productId));
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    if (err.message === 'Cart not found') return res.status(404).json({ message: 'Cart not found' });
    if (err.message === 'Item not found') return res.status(404).json({ message: 'Item not found in cart' });
    next(err);
  }
};

