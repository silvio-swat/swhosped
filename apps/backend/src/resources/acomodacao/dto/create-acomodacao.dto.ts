// src/acomodacao/dto/create-acomodacao.dto.ts
import { IsEnum, IsString, IsNumber, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { TipoAcomodacao } from '../entities/acomodacao.entity';
import { StatusAcomodacao } from '../entities/acomodacao.entity';
import { Transform } from 'class-transformer';

// Função auxiliar para transformação de valores para número
const toNumber = ({ value }) => value === "" ? null : Number(value);

export class CreateAcomodacaoDto {
  @IsEnum(TipoAcomodacao, { 
    message: `O campo 'tipo' deve ser um dos seguintes valores: ${Object.values(TipoAcomodacao).join(', ')}.`
  })
  @Transform(({ value }) => value === "Casa" ? TipoAcomodacao.CASA : value)
  @IsNotEmpty({ message: "O campo 'tipo' não pode estar vazio." })
  tipo: TipoAcomodacao;

  @IsString({ message: "O campo 'descricao' deve ser uma string." })
  @IsOptional()
  descricao: string;

  @Transform(toNumber)
  @IsNumber({}, { message: "O campo 'capacidade' deve ser um número." })
  @IsNotEmpty({ message: "O campo 'capacidade' é obrigatório." })
  capacidade: number;

  @IsString({ message: "O campo 'tipoLogradouro' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'tipoLogradouro' é obrigatório." })
  tipoLogradouro: string;

  @IsString({ message: "O campo 'logradouro' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'logradouro' é obrigatório." })
  logradouro: string;

  @IsString({ message: "O campo 'numero' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'numero' é obrigatório." })
  numero: string;

  @IsString({ message: "O campo 'bairro' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'bairro' é obrigatório." })
  bairro: string;

  @IsString({ message: "O campo 'cidade' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'cidade' é obrigatório." })
  cidade: string;

  @IsString({ message: "O campo 'estado' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'estado' é obrigatório." })
  estado: string;

  @IsString({ message: "O campo 'complemento' deve ser uma string." })
  @IsOptional()
  complemento?: string;

  @IsString({ message: "O campo 'cep' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'cep' é obrigatório." })
  cep: string;

  @IsString({ message: "O campo 'latitude' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'latitude' é obrigatório." })
  latitude: string;

  @IsString({ message: "O campo 'longitude' deve ser uma string." })
  @IsNotEmpty({ message: "O campo 'longitude' é obrigatório." })
  longitude: string;

  @Transform(toNumber)
  @IsNumber({}, { message: "O campo 'precoPorNoite' deve ser um número." })
  @IsNotEmpty({ message: "O campo 'precoPorNoite' é obrigatório." })
  precoPorNoite: number;

  @IsEnum(StatusAcomodacao, { 
    message: `O campo 'status' deve ser um dos seguintes valores: ${Object.values(StatusAcomodacao).join(', ')}.`
  })
  @IsNotEmpty({ message: "O campo 'status' é obrigatório." })
  status: StatusAcomodacao;

  @IsArray({ message: "O campo 'imagens' deve ser um array." })
  @IsOptional()
  imagens?: string[];
}
