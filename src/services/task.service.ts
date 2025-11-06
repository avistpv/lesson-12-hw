import {Op, WhereOptions} from "sequelize"
import AppError from "../errors.js"
import {Task, TaskAttributes} from "../models/task.model.js"
import {TaskStatus, TaskPriority} from "../models/task.model.js"
import {
    TaskFilters,
    TaskCreateInput,
    TaskUpdateInput,
} from "../types/task.types.js"

type AppliedFilters = WhereOptions<TaskAttributes>

const TASK_INCLUDE_OPTIONS = {include: ["assignee"]}

const findTaskWithAssignee = async (id: number) => {
    return await Task.findByPk(id, TASK_INCLUDE_OPTIONS)
}

const buildAppliedFilters = (filters?: TaskFilters): AppliedFilters | undefined => {
    const whereClause: Partial<TaskAttributes> & {
        createdAt?: { [Op.gte]: Date }
    } = {}

    if (filters?.status) {
        whereClause.status = filters.status
    }

    if (filters?.priority) {
        whereClause.priority = filters.priority
    }

    if (filters?.createdAt) {
        const createdAt = new Date(filters.createdAt)
        whereClause.createdAt = {
            [Op.gte]: createdAt,
        } as any
    }

    return Object.keys(whereClause).length > 0 ? (whereClause as AppliedFilters) : undefined
}

export const getTasks = async (filters?: TaskFilters) => {
    const whereClause = buildAppliedFilters(filters)

    return await Task.findAll({
        ...(whereClause && {where: whereClause}),
        ...TASK_INCLUDE_OPTIONS,
    })
}

export const getTaskById = async (id: number) => {
    return await findTaskWithAssignee(id)
}

export const createTask = async (input: TaskCreateInput) => {
    const createData: {
        title: string
        description?: string
        status: TaskStatus
        priority: TaskPriority
        userId: number
    } = {
        title: input.title,
        status: input.status || "pending",
        priority: input.priority || "medium",
        userId: input.userId,
    }

    if (input.description !== undefined) {
        createData.description = input.description
    }

    const newTask = await Task.create(createData)

    return await findTaskWithAssignee(newTask.id)
}

export const updateTask = async (id: number, input: TaskUpdateInput) => {
    const task = await Task.findByPk(id)
    if (!task) {
        return null
    }

    await task.update(input)

    return await findTaskWithAssignee(id)
}

export const deleteTask = async (id: number) => {
    const task = await Task.findByPk(id)
    if (!task) {
        throw new AppError("Task not found", 404)
    }

    await task.destroy()
    return task
}

