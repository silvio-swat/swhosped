// src/reserva/dto/filter-reserva.dto.ts
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto'
import { StatusReserva } from '../entities/reserva.entity';
import { IsDateRange } from '../../../validators/is-date-range';
export class FilterReservaAdminDto extends PaginationDto {
  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEnum(StatusReserva)
  status?: StatusReserva;

  @IsOptional()
  @IsDateString()
  @IsDateRange({ message: 'dataInicio e dataFim devem ser fornecidos juntos.' })
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;
}