// src/acomodacao/dto/update-acomodacao.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAcomodacaoDto } from './create-acomodacao.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TipoAcomodacao, StatusAcomodacao } from '../entities/acomodacao.entity';
import { Transform } from 'class-transformer';

const toNumber = ({ value }) => value === "" ? null : Number(value);

export class UpdateAcomodacaoDto extends PartialType(CreateAcomodacaoDto) {
  @IsOptional()
  @IsEnum(TipoAcomodacao)
  tipo?: TipoAcomodacao;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  capacidade?: number;

  @IsOptional()
  @IsString()
  tipoLogradouro?: string;

  @IsOptional()
  @IsString()
  logradouro?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @Transform(toNumber)
  @IsNumber()
  precoPorNoite?: number;

  @IsOptional()
  @IsEnum(StatusAcomodacao)
  status?: StatusAcomodacao;

  @IsOptional()
  imagens?: string[];

  @IsOptional()
  imagensRemovidas?: string[]; // Para marcar imagens que devem ser removidas
}