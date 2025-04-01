import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { TipoAcesso } from './../entities/usuario.entity';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
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

}