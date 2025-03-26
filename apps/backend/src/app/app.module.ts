import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './../../mikro-orm.config';
import { ClienteModule } from './../cliente/cliente.module';
import { UsuarioModule } from './../usuario/usuario.module';
import { AcomodacaoModule } from './../acomodacao/acomodacao.module';
import { ReservaModule } from './../reserva/reserva.module';
import { UserClientModule } from './../user-client/user-client.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ClienteModule,
    UsuarioModule,
    AcomodacaoModule,
    ReservaModule,
    UserClientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
