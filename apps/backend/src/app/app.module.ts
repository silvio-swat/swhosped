import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './../../mikro-orm.config';
import { ClienteModule } from './../cliente/cliente.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
