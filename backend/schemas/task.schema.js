import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  file: z.string({ required_error: "File is required" }).refine((value) => value !== null && value !== undefined),
  date: z.string().datetime().optional(),
});