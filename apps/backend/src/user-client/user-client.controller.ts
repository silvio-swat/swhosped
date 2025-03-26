// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { UserClientService } from './user-client.service';
import { CreateUserClientDto } from './dto/create-user-client.dto';
// import { UpdateUserClientDto } from './dto/update-user-client.dto';

@Controller('user-client')
export class UserClientController {
  constructor(private readonly userClientService: UserClientService) {}

  @Post()
  async create(@Body() createDto: CreateUserClientDto) {
    return this.userClientService.createUserAndClient(createDto);
  }
}
