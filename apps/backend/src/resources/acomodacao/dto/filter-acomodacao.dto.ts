import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
import { TipoAcomodacao, StatusAcomodacao } from '../entities/acomodacao.entity';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class FilterAcomodacaoDto extends PaginationDto{
  @IsOptional()
  @IsEnum(TipoAcomodacao)
  tipo?: TipoAcomodacao;

  @IsOptional()
  @IsNumber()
  capacidade?: number;

  @IsOptional()
  @IsString()
  cidade?: string;


  @IsOptional()
  @IsString()
  estado?: string;  

  @IsOptional()
  @IsNumber()
  precoMin?: number;

  @IsOptional()
  @IsNumber()
  precoMax?: number;

  @IsOptional()
  @IsEnum(StatusAcomodacao)
  status?: StatusAcomodacao;
}
