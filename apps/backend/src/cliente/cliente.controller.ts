import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}

    @Post()
    async create(@Body() clienteData: Partial<Cliente>): Promise<Cliente> {
      return this.clienteService.create(clienteData);
    }
  
    @Get()
    async findAll(): Promise<Cliente[]> {
      return this.clienteService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Cliente | null> {
      return this.clienteService.findOne(id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() clienteData: Partial<Cliente>,
    ): Promise<Cliente> {
      return this.clienteService.update(id, clienteData);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<boolean> {
      return this.clienteService.remove(id);
    }    
}
