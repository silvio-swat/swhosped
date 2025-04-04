import { IsDate, IsNumber, IsObject, ValidateNested, IsEnum, IsString, IsNotEmpty, IsEmail, MinDate, Matches, MaxLength } from 'class-validator';
import { Type, Transform} from 'class-transformer';
import { StatusReserva } from '../entities/reserva.entity';

// Função auxiliar para transformar valores vazios em null ou números
const toNumber = ({ value }) => (value === "" ? null : Number(value));

class ClienteReservaDto {
    @IsString({ message: 'O nome completo deve ser uma string.' })
    @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
    @MaxLength(100, { message: 'O nome completo deve ter no máximo 100 caracteres.' })
    nomeCompleto: string;
  
    @IsEmail({}, { message: 'O e-mail informado não é válido.' }) 
    email: string;
  
    @IsString({ message: 'O telefone deve ser uma string.' })
    @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'O telefone deve estar no formato (XX) XXXXX-XXXX.' })
    telefone: string;
  
    @IsString({ message: 'O CPF deve ser uma string.' })
    @IsNotEmpty({ message: 'O CPF é obrigatório.' }) 
    @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'O CPF deve estar no formato XXX.XXX.XXX-XX.' })
    cpf: string;
}

class AcomodacaoReservaDto {
    @Transform(toNumber) // Converte string para number    
    @IsNumber({}, { message: 'O ID da acomodação deve ser um número.' })
    id: number;
}

export class CreateReservaDto {
    @IsObject({ message: 'Os dados do cliente devem ser um objeto válido.' })
    @ValidateNested()
    @Type(() => ClienteReservaDto)
    cliente: ClienteReservaDto;

    @IsObject({ message: 'Os dados da acomodação devem ser um objeto válido.' })
    @ValidateNested()
    @Type(() => AcomodacaoReservaDto)
    acomodacao: AcomodacaoReservaDto;

    @IsDate({ message: 'A data de check-in deve ser uma data válida.' })
    @MinDate(new Date(), { message: 'A data de check-in não pode ser no passado.' })
    @Type(() => Date)
    dataCheckIn: Date;

    @IsDate({ message: 'A data de check-out deve ser uma data válida.' })
    @Type(() => Date)
    dataCheckOut: Date;

    @Transform(toNumber) // Converte string para number  
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor total deve ser um número com no máximo duas casas decimais.' })
    valorTotal: number;

    @IsEnum(StatusReserva, { message: 'O status da reserva deve ser um valor válido.' })
    status: StatusReserva;
}