import { z } from 'zod';  

const validationItemSchema = z.object({
  name: z.string().min(1, 'Must insert item name'),  // Validate name length
  description: z.string().min(1, 'Must insert item description').optional(),  // Optional description, max length of 500
  price: z.number().positive('Price must be a positive number'),  // Price must be positive
});

// Validation function to handle validation and return error details if any
export const validateItemInput = (name: string, description: string, price: number) => {
  try {
    validationItemSchema.parse({ name, description, price });  // Validate input using Zod
    return { valid: true, errors: null }; // Validation passed
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      return {
        valid: false,
        errors,  // Collect error messages from Zod
      };
    }
    throw new Error('An unexpected error occurred during validation');
  }
};