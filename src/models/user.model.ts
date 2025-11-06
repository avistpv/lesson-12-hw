import {Optional} from "sequelize"
import {
    AllowNull,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript"
import {Task} from "./task.model.js"

interface UserAttributes {
    id: number
    name: string
    email: string
    active?: boolean
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {
}

@Table({tableName: "users"})
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare active: boolean

    @HasMany(() => Task)
    declare tasks: Task[]
}

