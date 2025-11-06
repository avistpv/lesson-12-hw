import express, {NextFunction, Request, Response} from "express"
import taskRoutes from "./routes/task.routes.js"
import AppError from "./errors.js"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!")
})

app.use("/tasks", taskRoutes)

app.use(
    (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
        console.error(err)

        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message)
        }

        res.status(500).send("Internal server error")
    },
)

export default app

