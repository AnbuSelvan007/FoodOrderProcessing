import { z } from 'zod';

/**
 * Environment variable schema.
 *
 * Validated at application startup. If any variable is missing or
 * has the wrong shape, the app crashes immediately with a descriptive
 * error — far better than a silent failure deep in an API call.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a valid URL'),
  VITE_APP_NAME: z.string().min(1).default('FoodieGuy'),
  VITE_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables. Check the console output.');
  }

  return parsed.data;
}

export const env: EnvConfig = validateEnv();
