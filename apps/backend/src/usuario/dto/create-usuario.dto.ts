import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TipoAcesso } from './../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome de usuário é obrigatório' })
  nomeUsuario!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha!: string;

  @IsEnum(TipoAcesso, { 
    message: 'Tipo de acesso deve ser "Cliente" ou "Administrador"' 
  })
  @IsNotEmpty()
  tipoAcesso!: TipoAcesso;

  @IsOptional()
  clienteId?: number; // Opcional para relacionamento com Cliente
}
