import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// Função auxiliar para transformação
const toNumber = ({ value }) => value === "" ? null : Number(value);

export class PaginationDto {
  
  @Transform(toNumber) // Converte string para number  
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Transform(toNumber) // Converte string para number
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}