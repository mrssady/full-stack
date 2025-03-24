import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

interface TodoRequest extends Request {
  payload: User;
}

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() request: TodoRequest) {
    createTodoDto.user_id = request.payload.id;
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Req() request: TodoRequest) {
    return this.todosService.findAll(request.payload.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: TodoRequest) {
    return this.todosService.findOne(+id, request.payload.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request: TodoRequest,
  ) {
    return this.todosService.update(+id, updateTodoDto, request.payload.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: TodoRequest) {
    return this.todosService.remove(+id, request.payload.id);
  }
}
