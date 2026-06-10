import { z } from "zod";

export type User = {
  id: number;
  username: string;
  email: string;
  names: string;
  phones?: Phone[];
};

export type Phone = {
  id?: number;
  user_id?: number;
  userID?: number;
  number: string;
};

const formString = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z.string()
);

export const createUserSchema = z.object({
  username: formString.pipe(
    z.string().trim().min(3, "Username must be at least 3 characters.")
  ),
  names: formString.pipe(
    z.string().trim().min(3, "Name must be at least 3 characters.")
  ),
  email: formString.pipe(z.string().trim().email("Email is invalid.")),
});

export const updateUserSchema = z.object({
  names: formString.pipe(
    z.string().trim().min(3, "Name must be at least 3 characters.")
  ),
  email: formString.pipe(z.string().trim().email("Email is invalid.")),
});

export const phoneSchema = z.object({
  number: formString.pipe(
    z
      .string()
      .trim()
      .regex(/^\d{8,}$/, "Phone number must contain at least 8 digits.")
  ),
});

export const createPhoneSchema = phoneSchema.extend({
  user_id: formString.pipe(
    z
      .string()
      .min(1, "Please select a user.")
      .transform((value) => Number(value))
      .refine((value) => value > 0, "Please select a user.")
  ),
});

export const updatePhoneSchema = createPhoneSchema;

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PhoneNumber = z.infer<typeof phoneSchema>;
export type CreatePhone = z.infer<typeof createPhoneSchema>;
export type UpdatePhone = z.infer<typeof updatePhoneSchema>;

export function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message || "Invalid data.";
}
