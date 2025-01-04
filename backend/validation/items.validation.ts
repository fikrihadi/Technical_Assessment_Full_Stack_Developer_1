import { z } from 'zod';  

const validationItemSchema = z.object({
  name: z.string().min(1).max(100, 'Name must be between 1 and 100 characters'),  // Validate name length
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),  // Optional description, max length of 500
  price: z.number().positive('Price must be a positive number'),  // Price must be positive
});

// Validation function to handle validation and return error details if any
export const validateItemInput = (name: string, description: string, price: number) => {
  try {
    validationItemSchema.parse({ name, description, price });  // Validate input using Zod
    return null;  // No validation errors
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.errors.map((e) => e.message).join(', '),  // Collect error messages from Zod
      };
    }
    throw new Error('An unexpected error occurred during validation');
  }
};