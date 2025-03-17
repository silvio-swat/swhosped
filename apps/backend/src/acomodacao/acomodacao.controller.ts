import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';

import { Roles } from './../common/decorators/roles.decorator';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Role } from './../common/enums/role.enum';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Controller('acomodacao')
export class AcomodacaoController {
  constructor(private readonly acomodacaoService: AcomodacaoService) {}

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createAcomodacaoDto: CreateAcomodacaoDto) {
    return this.acomodacaoService.create(createAcomodacaoDto);
  }

  @Get()
  findAll() {
    return this.acomodacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acomodacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcomodacaoDto: UpdateAcomodacaoDto) {
    return this.acomodacaoService.update(+id, updateAcomodacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acomodacaoService.remove(+id);
  }
}
