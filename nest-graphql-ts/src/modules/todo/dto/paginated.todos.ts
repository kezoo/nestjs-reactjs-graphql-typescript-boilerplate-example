import { ObjectType } from "@nestjs/graphql"
import { Paginated } from "../../_common/pagination/Paginated"
import { Task } from "../task.entity"

@ObjectType()
export class PaginatedTodos extends Paginated(Task) {}
