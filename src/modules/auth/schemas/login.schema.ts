import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/shared/validators';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
