import { signInSchema, signUpSchema } from "../validators/auth.js";
import { deactivateSellerAccount, deleteClientAccount, signIn, signUp } from "../service/auth.service.js";

export const signUpController = async (req, res, next) => {
  try {
    const data = signUpSchema.parse(req.body);
    const token = await signUp(data);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const signInController = async (req, res, next) => {
  try {
    const data = signInSchema.parse(req.body);
    const token = await signIn(data);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const deleteClientAccountController = async (req, res, next) => {
  try {
    const result = await deleteClientAccount(req.user.id);
    res.json({ message: 'Client account deleted', ...result });
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    if (err.message === 'User not found') return res.status(404).json({ message: 'User not found' });
    next(err);
  }
};

export const deactivateSellerAccountController = async (req, res, next) => {
  try {
    const result = await deactivateSellerAccount(req.user.id);
    res.json({ message: 'Seller account deactivated', ...result });
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    if (err.message === 'User not found') return res.status(404).json({ message: 'User not found' });
    next(err);
  }
};


