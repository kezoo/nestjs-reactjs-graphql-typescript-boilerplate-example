import { Controller, Get, Query } from "@nestjs/common"
import { PaginationArgs } from "../_common/pagination/pagination.args"
import { Task } from "./task.entity"
import { TodoService } from "./todo.service"

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(
    @Query() query: PaginationArgs<Task>,
  ): Promise<Task[]> {
    console.log(`findAll query `, query)
    return this.todoService.findAllWithPagination(query)
  }
}
