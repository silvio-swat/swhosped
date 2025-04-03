import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TipoAcesso } from '../../resources/usuario/entities/usuario.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nomeUsuario: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsString()
  @IsNotEmpty()
  tipoAcesso: TipoAcesso;
}