import {NextFunction, Request, Response} from "express"
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from "../services/task.service.js"
import AppError from "../errors.js"
import {TaskFilters, TaskRequestBody} from "../types/task.types.js"
import {
    buildFiltersFromQuery,
    convertRequestBodyToCreateInput,
    convertRequestBodyToUpdateInput,
} from "../utils/task.utils.js"

const asyncHandler = <
    P = {},
    ResBody = {},
    ReqBody = {},
    ReqQuery = {},
>(
    fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>) => Promise<void | Response<ResBody>>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req as Request<P, ResBody, ReqBody, ReqQuery>, res)
        } catch (error) {
            next(error)
        }
    }
}

export const getAllTasks = asyncHandler<{}, {}, {}, TaskFilters>(
    async (req, res) => {
        const filters = buildFiltersFromQuery(req.query)
        const tasks = await getTasks(filters)
        res.json(tasks)
    }
)

export const getTask = asyncHandler<{ id: string }>(
    async (req, res) => {
        const taskId = req.params.id as unknown as number
        const task = await getTaskById(taskId)

        if (!task) {
            throw new AppError("Task not found", 404)
        }

        res.json(task)
    }
)

export const createTaskHandler = asyncHandler<{}, unknown, TaskRequestBody>(
    async (req, res) => {
        const input = convertRequestBodyToCreateInput(req.body)
        const newTask = await createTask(input)

        res.status(201).json(newTask)
    }
)

export const updateTaskHandler = asyncHandler<{ id: string }, unknown, TaskRequestBody>(
    async (req, res) => {
        const taskId = req.params.id as unknown as number
        const input = convertRequestBodyToUpdateInput(req.body)
        const updatedTask = await updateTask(taskId, input)

        if (!updatedTask) {
            throw new AppError("Task not found", 404)
        }

        res.json(updatedTask)
    }
)

export const deleteTaskHandler = asyncHandler<{ id: string }>(
    async (req, res) => {
        const taskId = req.params.id as unknown as number
        await deleteTask(taskId)
        res.status(204).send()
    }
)

