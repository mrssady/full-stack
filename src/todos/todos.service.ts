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

  async findAll() {
    return this.prisma.todo.findMany();
  }

  async findOne(id: number) {
    return this.getTodo(id);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.getTodo(id);
    return this.prisma.todo.delete({ where: { id } });
  }

  async remove(id: number) {
    await this.getTodo(id);
    return this.prisma.todo.delete({ where: { id } });
  }

  private async getTodo(id: number) {
    const todo = await this.prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`No tofo found with id ${id}`);
    }
    return todo;
  }
}
