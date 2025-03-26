import { Module } from '@nestjs/common';
import { UserClientService } from './user-client.service';
import { UserClientController } from './user-client.controller';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsuarioService } from '../usuario/usuario.service';
import { ClienteService } from '../cliente/cliente.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Cliente } from '../cliente/cliente.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Usuario, Cliente]),
  ],  
  controllers: [UserClientController],
  providers: [UserClientService, UsuarioService, ClienteService],
  exports: [UserClientService]
})
export class UserClientModule {}
