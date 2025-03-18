import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from './entities/role.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.OWNER)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findUserById(id);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Public()
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

  @Public()
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDTO: UpdateUserDTO
  ) {
    return this.userService.updateUser({ id, ...updateUserDTO });
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }

  @Roles(Role.ADMIN)
  @Delete()
  async removeAll() {
    return await this.userService.removeAll();
  }
}
