// import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Controller, Post, Body, HttpCode, HttpStatus, ConflictException, Get, UsePipes, ValidationPipe, Query, Patch, Param, NotFoundException } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { FilterReservaDto } from './dto/filtro-reserva.dto';
import { PaginatedReservaResult } from './reserva.interface';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReservaDto: CreateReservaDto): Promise<Reserva> {
    try {
      return await this.reservaService.create(createReservaDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
          error: 'Conflito de Reserva'
        });
      }
      throw error;
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filters: FilterReservaDto): Promise<PaginatedReservaResult> {
    return this.reservaService.findAllWithFilters(filters);
  }

  // Método para cancelar a reserva
  @Patch(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  async cancelarReserva(@Param('id') id: number): Promise<Reserva> {
    try {
      return await this.reservaService.cancelarReserva(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Reserva não encontrada',
        });
      }
      throw error;
    }
  }  

  // @Get()
  // async findAll(): Promise<Reserva[]> {
  //   return this.reservaService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: number): Promise<Reserva> {
  //   return this.reservaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
  //   return this.reservaService.update(+id, updateReservaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservaService.remove(+id);
  // }
}
