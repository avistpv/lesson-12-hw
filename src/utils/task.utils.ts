import { TaskFilters, TaskRequestBody, TaskCreateInput, TaskUpdateInput } from "../types/task.types.js"

export const buildFiltersFromQuery = <T extends TaskFilters>(query: T): TaskFilters => {
    const filters: TaskFilters = {}

    if (query.createdAt) {
        filters.createdAt = query.createdAt
    }
    if (query.status) {
        filters.status = query.status
    }
    if (query.priority) {
        filters.priority = query.priority
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

export const convertRequestBodyToCreateInput = (body: TaskRequestBody): TaskCreateInput => {
    const input: TaskCreateInput = {
        title: body.title!,
        userId: body.userId as number,
    }

    if (body.description !== undefined) {
        input.description = body.description
    }
    if (body.status !== undefined) {
        input.status = body.status
    }
    if (body.priority !== undefined) {
        input.priority = body.priority
    }

    return input
}

export const convertRequestBodyToUpdateInput = (body: TaskRequestBody): TaskUpdateInput => {
    const input: TaskUpdateInput = {}

    assignIfDefined(input, "title", body.title, String)
    assignIfDefined(input, "description", body.description, String)
    assignIfDefined(input, "status", body.status)
    assignIfDefined(input, "priority", body.priority)

    if (body.userId) {
        input.userId = Number(body.userId)
    }

    return input
}
