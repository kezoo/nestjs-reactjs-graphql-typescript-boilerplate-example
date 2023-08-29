import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { paginate } from "../_common/pagination/paginate"
import { PaginationArgs } from "../_common/pagination/pagination.args"
import { Task } from "./task.entity"


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create (title: string) {
    const task = this.taskRepository.create({title})
    return this.taskRepository.save(task)
  }

  findAll() {
    return this.taskRepository.find()
  }

  async findAllWithPagination (paginationArgs: PaginationArgs<Task>) {
    const res = await paginate(
      paginationArgs,
      { mainTableName: 'task', }
    )
    return res
  }

  async findOne(id: Task['id']) {
    const task = await this.taskRepository.findOneBy({id})

    if (!task) throw new NotFoundException('Task not exist');

    return task;
  }

  async updateOne(
    id: Task['id'],
    changes: Partial<Pick<Task, 'title' | 'completed'>>,
  ) {
    const task = await this.findOne(id)

    this.taskRepository.merge(task, changes)

    return this.taskRepository.save(task)
  }

  async remove(id: Task['id']) {
    const task = await this.findOne(id)

    await this.taskRepository.delete({id})

    return task
  }
}
