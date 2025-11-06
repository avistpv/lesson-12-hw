import {TaskStatus, TaskPriority} from "../models/task.model.js"

export interface TaskBaseFields {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
}

export interface TaskFilters extends Pick<TaskBaseFields, "status" | "priority"> {
    createdAt?: string
}

export interface TaskCreateInput extends Required<Pick<TaskBaseFields, "title">> {
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    userId: number
}

export interface TaskUpdateInput extends TaskBaseFields {
    userId?: number
}

export interface TaskRequestBody extends TaskBaseFields {
    userId?: number | string
}

export interface TaskQueryParams extends TaskFilters {
}

