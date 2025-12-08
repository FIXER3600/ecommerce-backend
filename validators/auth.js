import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CLIENT', 'SELLER']),
  storeName: z.string().min(2).optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

