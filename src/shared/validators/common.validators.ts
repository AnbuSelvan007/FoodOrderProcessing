import { z } from 'zod';

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters long')
  .max(50, 'Password is too long');

export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long')
  .regex(/^\+?[0-9]+$/, 'Phone number can only contain digits and an optional leading +');

export const requiredString = (fieldName: string, minLength: number = 1, maxLength: number = 255) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} cannot exceed ${maxLength} characters`);

export const positiveNumberSchema = (fieldName: string) =>
  z
    .number({ required_error: `${fieldName} is required` })
    .positive(`${fieldName} must be a positive number`);
