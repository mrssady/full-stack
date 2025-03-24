import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({ data: createTodoDto });
  }

  async findAll(user_id: number) {
    return this.prisma.todo.findMany({ where: { user_id } });
  }

  async findOne(id: number, user_id: number) {
    return this.getTodo(id, user_id);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user_id: number) {
    await this.getTodo(id, user_id);
    return this.prisma.todo.update({ where: { id }, data: updateTodoDto });
  }

  async remove(id: number, user_id: number) {
    await this.getTodo(id, user_id);
    return this.prisma.todo.delete({ where: { id } });
  }

  private async getTodo(id: number, user_id: number) {
    const todo = await this.prisma.todo.findFirst({ where: { id, user_id } });
    if (!todo) {
      throw new NotFoundException(`No todo found with id ${id}`);
    }
    return todo;
  }
}
