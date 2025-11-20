import {NextFunction, Request, Response} from "express"
import {z} from "zod"
import AppError from "../errors.js"

const taskStatusEnum = z.enum(["pending", "in-progress", "completed"])
const taskPriorityEnum = z.enum(["low", "medium", "high"])

export const queryParamsSchema = z.object({
    createdAt: z.string().datetime().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
})

const baseTaskSchema = z.object({
    title: z.string({message: "Title is required"}).min(1, "Title is required"),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    userId: z
        .union([z.number(), z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
            message: "User ID must be a valid number",
        })
        .optional(),
})

export const createTaskSchema = baseTaskSchema.refine((data) => data.userId !== undefined, {
    message: "User ID (assignee) is required",
    path: ["userId"],
})

export const updateTaskSchema = baseTaskSchema.partial()

export const taskIdParamsSchema = z.object({
    id: z
        .union([z.number(), z.string()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
            message: "Task ID must be a number",
        }),
})

export function validateZodSchema(
    schema: z.ZodSchema,
    errorMessage?: string,
    useQuery = false,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = useQuery ? req.query : req.body
            const parsed = schema.parse(data)
            if (useQuery) {
                Object.assign(req.query, parsed)
            } else {
                Object.assign(req.body, parsed)
            }
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                if (errorMessage) {
                    return next(new AppError(errorMessage, 400))
                }
                const firstIssue = error.issues[0]
                if (firstIssue) {
                    return next(new AppError(firstIssue.message, 400))
                }
                return next(new AppError("Invalid input", 400))
            }
            next(error)
        }
    }
}

export function validateRouteParams(
    schema: z.ZodSchema,
    errorMessage?: string,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.params)
            Object.assign(req.params, parsed)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                if (errorMessage) {
                    return next(new AppError(errorMessage, 400))
                }
                const firstIssue = error.issues[0]
                if (firstIssue) {
                    return next(new AppError(firstIssue.message, 400))
                }
                return next(new AppError("Invalid input", 400))
            }
            next(error)
        }
    }
}

