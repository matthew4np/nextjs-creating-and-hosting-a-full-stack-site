import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Zod schema for creating/updating a user.
// This defines the shape and validation rules for the data.
export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  // Add more password constraints as needed, e.g., .min(8)
  password: z.string().min(1, { message: 'Password is required' }),
  // You can add other fields here and mark them as optional if needed
  cartIds: z.array(z.string()).optional(),
  // e.g., address: z.string().optional()
});

// This TypeScript type is inferred from the Zod schema.
// It represents the data structure for creating a user.
export type User = z.infer<typeof UserSchema>;

// This type represents a user document as it is stored in MongoDB, including the _id.
export type UserDocument = User & {
  _id: ObjectId;
};