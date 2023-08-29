import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"
import { PaginationArgs } from "../_common/pagination/pagination.args"
import { PaginatedTodos } from "./dto/paginated.todos"
import { UpdateTask } from "./dto/update-task.dto"
import { Task } from "./task.entity"
import { TodoService } from "./todo.service"

@Resolver(() => Task)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => Task)
  async todo(@Args('id', {type: () => ID}) id: Task['id']) {
    return this.todoService.findOne(id)
  }

  @Query(() => [Task])
  todos(
  ) {
    return this.todoService.findAll();
  }

  @Query(() => PaginatedTodos)
  todoListWithPagination(
    @Args() paginationArgs: PaginationArgs<Task>,
  ) {
    return this.todoService.findAllWithPagination(paginationArgs)
  }

  @Mutation(() => Task)
  async addTodo(
    @Args('title') title: string,
  ) {
    return this.todoService.create(title);
  }

  @Mutation(() => Task)
  updateTodo(
    @Args('id', {type: () => ID}) id: Task['id'],
    @Args('updateTaskInput') changes: UpdateTask,
  ) {
    return this.todoService.updateOne(id, changes)
  }

  @Mutation(() => Task)
  async removeTodo(@Args('id', {type: () => ID}) id: Task['id']) {
    return this.todoService.remove(id)
  }

}
