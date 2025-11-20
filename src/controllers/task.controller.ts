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
    fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>
    ) => Promise<void | Response<ResBody>>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-expect-error - Express provides Request<ParamsDictionary> but validation middleware ensures correct types at runtime
            await fn(req, res)
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

export const getTask = asyncHandler<{ id: number }>(
    async (req, res) => {
        const task = await getTaskById(req.params.id)

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

export const updateTaskHandler = asyncHandler<{ id: number }, unknown, TaskRequestBody>(
    async (req, res) => {
        const input = convertRequestBodyToUpdateInput(req.body)
        const updatedTask = await updateTask(req.params.id, input)

        if (!updatedTask) {
            throw new AppError("Task not found", 404)
        }

        res.json(updatedTask)
    }
)

export const deleteTaskHandler = asyncHandler<{ id: number }>(
    async (req, res) => {
        await deleteTask(req.params.id)
        res.status(204).send()
    }
)

