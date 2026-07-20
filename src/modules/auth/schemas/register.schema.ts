import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema, requiredString } from '@/shared/validators';

export const registerSchema = z.object({
  name: requiredString('Name', 2, 50),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
