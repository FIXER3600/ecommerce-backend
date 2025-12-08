import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  imageUrl: z.string().url(),
  publishedAt: z.string().optional(),
});

