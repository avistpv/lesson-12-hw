import {NextFunction, Request, Response, Router} from "express"
import {z} from "zod"
import {
    getAllTasks,
    getTask,
    createTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from "../controllers/task.controller.js"
import AppError from "../errors.js"

const router = Router()

const taskStatusEnum = z.enum(["pending", "in-progress", "completed"])
const taskPriorityEnum = z.enum(["low", "medium", "high"])

const queryParamsSchema = z.object({
    createdAt: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
})

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
})

const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
})

function validateZodSchema(
    schema: z.ZodSchema,
    errorMessage?: string,
    useQuery = false,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = useQuery ? req.query : req.body
            schema.parse(data)
            next()
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message =
                    errorMessage ||
                    error.issues.map((e: z.ZodIssue) => e.message).join(", ")
                return next(new AppError(message, 400))
            }
            next(error)
        }
    }
}

const validateQueryParams = validateZodSchema(
    queryParamsSchema,
    "Invalid query parameters",
    true,
)
const validateCreateTask = validateZodSchema(createTaskSchema)
const validateUpdateTask = validateZodSchema(updateTaskSchema)

router.get("/", validateQueryParams, getAllTasks)
router.get("/:id", getTask)
router.post("/", validateCreateTask, createTaskHandler)
router.put("/:id", validateUpdateTask, updateTaskHandler)
router.delete("/:id", deleteTaskHandler)

export default router

