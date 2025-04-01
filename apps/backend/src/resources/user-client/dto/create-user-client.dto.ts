// create-user-client.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsPhoneNumber, IsStrongPassword } from 'class-validator';
import { TipoAcesso } from './../../usuario/entities/usuario.entity';

export class CreateUserClientDto {
  // Dados do usuário
  @IsString()
  @IsNotEmpty({
    message: 'Por favor, preencha o nome!',
  })  
  nomeUsuario: string;

  @IsString()
  @IsNotEmpty({
    message: 'Por favor, preencha a Senha!',
  })  
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },
  {
    message: 'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo',
  },)
  senha: string;

  @IsEnum(TipoAcesso)
  tipoAcesso: TipoAcesso;
  
  // Dados do cliente
  @IsString()
  @IsNotEmpty({
    message: 'Por favor, preencha o Nome Completo!',
  })
  nomeCompleto: string;

  @IsNotEmpty({
    message: 'Por favor, preencha o e-mail!',
  })
  @IsEmail({}, { 
    message: 'Por favor, forneça um endereço de e-mail válido' 
  })
  email: string;

  @IsPhoneNumber('BR', { 
    message: 'Por favor, forneça um número de telefone válido para o Brasil (ex: +55 11 98765-4321)' 
  })
  telefone: string;

  @IsString()
  @IsNotEmpty({
    message: 'Por favor, preencha o CPF!',
  })
  cpf: string;
}