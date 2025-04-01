import { IsDate, IsNumber, IsObject, ValidateNested, IsEnum, IsString, IsNotEmpty, IsEmail, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusReserva } from '../entities/reserva.entity';
import { Transform } from 'class-transformer';

// Função auxiliar para transformação
const toNumber = ({ value }) => value === "" ? null : Number(value);

class ClienteReservaDto {
    @IsString()
    @IsNotEmpty()
    nomeCompleto: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    telefone: string;
  
    @IsString()
    @IsNotEmpty()
    cpf: string;
}

class AcomodacaoReservaDto {
  @Transform(toNumber) // Converte string para number    
  @IsNumber()
  id: number;
}

export class CreateReservaDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ClienteReservaDto)
  cliente: ClienteReservaDto;

  @IsObject()
  @ValidateNested()
  @Type(() => AcomodacaoReservaDto)
  acomodacao: AcomodacaoReservaDto;

  @IsDate()
  @MinDate(new Date(), { message: 'Data de check-in não pode ser no passado' })
  @Type(() => Date)
  dataCheckIn: Date;

  @IsDate()
  @Type(() => Date)
  dataCheckOut: Date;

  @Transform(toNumber) // Converte string para number  
  @IsNumber({ maxDecimalPlaces: 2 })
  valorTotal: number;

  @IsEnum(StatusReserva)
  status: StatusReserva;
}