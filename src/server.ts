import app from "./app.js"
import db from "./config/database.js"

const PORT = 3000

async function main() {
    try {
        await db.authenticate()
        console.log("Database connected successfully.")

        await db.sync({alter: true})
        console.log("Database synced")
    } catch (error) {
        console.error("Unable to connect to the database:", error)
    }

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
}

main()

