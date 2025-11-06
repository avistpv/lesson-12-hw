import {NextFunction, Request, Response} from "express"
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from "../services/task.service.js"
import AppError from "../errors.js"
import {
    TaskFilters,
    TaskRequestBody,
    TaskCreateInput,
    TaskUpdateInput,
} from "../types/task.types.js"
import {TaskStatus, TaskPriority} from "../models/task.model.js"

function validateTaskId(id: string | undefined, next: NextFunction): number | null {
    if (!id) {
        next(new AppError("Task ID is required", 400))
        return null
    }
    const numericId = Number(id)
    if (isNaN(numericId)) {
        next(new AppError("Task ID must be a number", 400))
        return null
    }
    return numericId
}

const buildFiltersFromQuery = (query: Request["query"]): TaskFilters => {
    const filters: TaskFilters = {}

    if (query.createdAt) {
        filters.createdAt = query.createdAt as string
    }
    if (query.status) {
        filters.status = query.status as TaskStatus
    }
    if (query.priority) {
        filters.priority = query.priority as TaskPriority
    }

    return filters
}

const assignIfDefined = <T extends Record<string, any>, K extends keyof T>(
    target: T,
    key: K,
    value: T[K] | undefined | null,
    transform?: (val: NonNullable<T[K]>) => T[K]
): void => {
    if (value !== undefined && value !== null) {
        target[key] = transform ? transform(value as NonNullable<T[K]>) : (value as T[K])
    }
}

const convertRequestBodyToCreateInput = (body: TaskRequestBody): TaskCreateInput => {
    const input: TaskCreateInput = {
        title: String(body.title!),
        userId: Number(body.userId!),
    }

    assignIfDefined(input, "description", body.description, String)
    assignIfDefined(input, "status", body.status)
    assignIfDefined(input, "priority", body.priority)

    return input
}

const convertRequestBodyToUpdateInput = (body: TaskRequestBody): TaskUpdateInput => {
    const input: TaskUpdateInput = {}

    assignIfDefined(input, "title", body.title, String)
    assignIfDefined(input, "description", body.description, String)
    assignIfDefined(input, "status", body.status)
    assignIfDefined(input, "priority", body.priority)

    if (body.userId !== undefined && body.userId !== null) {
        input.userId = Number(body.userId)
    }

    return input
}

const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

export const getAllTasks = asyncHandler(async (req, res) => {
    const filters = buildFiltersFromQuery(req.query)
    const tasks = await getTasks(filters)
    res.json(tasks)
})

export const getTask = asyncHandler(async (req, res, next) => {
    const taskId = validateTaskId(req.params.id, next)
    if (taskId === null) {
        return
    }

    const task = await getTaskById(taskId)

    if (!task) {
        throw new AppError("Task not found", 404)
    }

    res.json(task)
})

export const createTaskHandler = asyncHandler(async (req, res) => {
    const body = req.body as TaskRequestBody

    if (!body.title) {
        throw new AppError("Title is required", 400)
    }

    if (!body.userId) {
        throw new AppError("User ID (assignee) is required", 400)
    }

    const input = convertRequestBodyToCreateInput(body)
    const newTask = await createTask(input)

    res.status(201).json(newTask)
})

export const updateTaskHandler = asyncHandler(async (req, res, next) => {
    const taskId = validateTaskId(req.params.id, next)
    if (taskId === null) {
        return
    }

    const body = req.body as TaskRequestBody
    const input = convertRequestBodyToUpdateInput(body)
    const updatedTask = await updateTask(taskId, input)

    if (!updatedTask) {
        throw new AppError("Task not found", 404)
    }

    res.json(updatedTask)
})

export const deleteTaskHandler = asyncHandler(async (req, res, next) => {
    const taskId = validateTaskId(req.params.id, next)
    if (taskId === null) {
        return
    }

    await deleteTask(taskId)
    res.status(204).send()
})

