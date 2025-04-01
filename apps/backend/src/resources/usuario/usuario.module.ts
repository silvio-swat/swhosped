import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Usuario } from './../usuario/entities/usuario.entity'; // Importação da entidade

@Module({
  imports: [MikroOrmModule.forFeature([Usuario])],  
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],  
})
export class UsuarioModule {}
