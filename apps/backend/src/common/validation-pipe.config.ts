import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class PortugueseValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        // Extrai todas as mensagens de erro
        const errorMessages = errors.flatMap(error => 
          Object.values(error.constraints).map(msg => {
            // Mantém mensagens customizadas (já em português)
            if (/[áéíóúâêîôûãõç]/i.test(msg)) {
              return msg;
            }
            
            // Traduz mensagens padrão do class-validator
            return msg
              .replace(/must be a string/gi, 'Deve ser um texto')
              .replace(/should not be empty/gi, 'Não pode estar vazio')
              .replace(/must be an email/gi, 'Deve ser um e-mail válido')
              .replace(/is not strong enough/gi, 'A senha não atende aos requisitos mínimos')
              .replace(/The password must be/gi, 'A senha deve conter');
          })
        );

        // Retorna APENAS a primeira mensagem de erro (como o ValidationPipe padrão)
        throw new BadRequestException(errorMessages[0]);
      },
    });
  }
}