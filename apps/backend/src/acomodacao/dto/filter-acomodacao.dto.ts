// src/acomodacao/dto/create-acomodacao.dto.ts
import { IsEnum, IsString, IsNumber, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { TipoAcomodacao } from '../entities/acomodacao.entity';
import { StatusAcomodacao } from '../entities/acomodacao.entity';
import { Transform } from 'class-transformer';

// Função auxiliar para transformação
const toNumber = ({ value }) => value === "" ? null : Number(value);

export class CreateAcomodacaoDto {
  @IsEnum(TipoAcomodacao, { 
    message: `tipo deve ser um dos: ${Object.values(TipoAcomodacao).join(', ')}`
  })
  @Transform(({ value }) => value === "Casa" ? TipoAcomodacao.CASA : value)
  @IsNotEmpty()
  tipo: TipoAcomodacao;

  @IsString()
  @IsOptional()
  descricao: string;

  @Transform(toNumber) // Converte string para number
  @IsNumber()
  @IsNotEmpty()
  capacidade: number;


  @IsString()
  @IsNotEmpty()
  tipoLogradouro: string;

  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;

  @Transform(toNumber)
  @IsNumber()
  @IsNotEmpty()
  precoPorNoite: number;

  @IsEnum(StatusAcomodacao)
  @IsNotEmpty()
  status: StatusAcomodacao;

  @IsArray()
  @IsOptional()
  imagens?: string[];
}