import { Module } from '@nestjs/common';
import { UserClientService } from './user-client.service';
import { UserClientController } from './user-client.controller';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsuarioService } from '../usuario/usuario.service';
import { ClienteService } from '../cliente/cliente.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Cliente } from '../cliente/cliente.entity';
import { ValidationPipe } from '@nestjs/common';
import { IsUniqueConstraint } from './dto/unique-validator';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    MikroOrmModule.forFeature([Usuario, Cliente]),
  ],  
  controllers: [UserClientController],
  providers: [
    UserClientService,
    UsuarioService,
    ClienteService,
    IsUniqueConstraint, // Registra o validador
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // Habilita validação global
    },    
  ],
  exports: [UserClientService]
})
export class UserClientModule {}
