import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { TodoController } from './todo.controller'
import { TodoResolver } from './todo.resolver'
import { TodoService } from './todo.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TodoController],
  providers: [TodoResolver, TodoService,],
})

export class TodoModule {}
