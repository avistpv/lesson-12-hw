import dotenv from "dotenv"
import {Dialect} from "sequelize"
import {Sequelize} from "sequelize-typescript"

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
})

interface DBConfig {
    [key: string]: {
        username?: string
        password?: string
        database?: string
        host?: string
        port?: number
        dialect: Dialect
        storage?: string
        logging?: boolean
    }
}

const config: DBConfig = {
    development: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "db_development",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
    },
    test: {
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    },
}

const db = new Sequelize({
    ...config[process.env.NODE_ENV || "development"],
    models: [__dirname + "/../models"],
})

export default db