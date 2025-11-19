import {Router} from "express"
import {
    getAllTasks,
    getTask,
    createTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from "../controllers/task.controller.js"
import {
    queryParamsSchema,
    createTaskSchema,
    updateTaskSchema,
    taskIdParamsSchema,
    validateZodSchema,
    validateRouteParams,
} from "../utils/validation.js"

const router = Router()

const validateQueryParams = validateZodSchema(
    queryParamsSchema,
    "Invalid query parameters",
    true,
)
const validateCreateTask = validateZodSchema(createTaskSchema)
const validateUpdateTask = validateZodSchema(updateTaskSchema)
const validateTaskId = validateRouteParams(taskIdParamsSchema)

router.get("/", (req, res, next) => {
    if (req.originalUrl === "/tasks/") {
        return res.status(404).send("Not Found")
    }
    next()
}, validateQueryParams, getAllTasks)
router.get("/:id", validateTaskId, getTask)
router.post("/", validateCreateTask, createTaskHandler)
router.put("/:id", validateTaskId, validateUpdateTask, updateTaskHandler)
router.delete("/:id", validateTaskId, deleteTaskHandler)

export default router
