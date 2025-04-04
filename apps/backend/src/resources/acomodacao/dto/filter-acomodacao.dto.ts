import { IsOptional, IsEnum, IsNumber, IsString, IsDateString, IsBoolean } from 'class-validator';
import { TipoAcomodacao, StatusAcomodacao } from '../entities/acomodacao.entity';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { Transform } from 'class-transformer';

// Função auxiliar para transformação de valores para número
const toNumber = ({ value }) => value === "" ? null : Number(value);

export class FilterAcomodacaoDto extends PaginationDto{
  @IsOptional()
  @IsEnum(TipoAcomodacao)
  tipo?: TipoAcomodacao;

  @Transform(toNumber)  
  @IsOptional()
  @IsNumber()
  capacidade?: number;

  @IsOptional()
  @IsString()
  cidade?: string;


  @IsOptional()
  @IsString()
  estado?: string;  

  @Transform(toNumber)  
  @IsOptional()
  @IsNumber()
  precoMin?: number;

  @Transform(toNumber)  
  @IsOptional()
  @IsNumber()
  precoMax?: number;

  @IsOptional()
  @IsEnum(StatusAcomodacao)
  status?: StatusAcomodacao;

  // Novos campos para data
  @IsOptional()
  @IsDateString()
  checkin?: string;

  @IsOptional()
  @IsDateString()
  checkout?: string;

  @IsOptional()
  @IsString()
  isPublic?: string;

}
