import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { TodoResolver } from './todo.resolver'
import { TodoService } from './todo.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TodoResolver, TodoService,],
})

export class TodoModule {}
