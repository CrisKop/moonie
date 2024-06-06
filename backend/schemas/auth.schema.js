import {z} from "zod";

export const registerSchema = z.object({
    username: z.string({ required_error: "Username is required" }),
    password: z.string({ required_error: "Password is required" }).min(4, {message: "Min 4 characters"}),
})

export const loginSchema = z.object({
    username: z.string({ required_error: "Username is required" }),
    password: z.string({ required_error: "Password is required" }),
})