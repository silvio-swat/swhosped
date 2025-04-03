import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './../../mikro-orm.config';
import { ClienteModule } from '../resources/cliente/cliente.module';
import { UsuarioModule } from './../resources/usuario/usuario.module';
import { AcomodacaoModule } from '../resources/acomodacao/acomodacao.module';
import { ReservaModule } from './../resources/reserva/reserva.module';
import { UserClientModule } from '../resources/user-client/user-client.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ClienteModule,
    UsuarioModule,
    AcomodacaoModule,
    ReservaModule,
    UserClientModule,
    ServeStaticModule.forRoot({
      // Use process.cwd() para apontar para o diretório de trabalho atual, que deve ser a raiz do módulo backend
      rootPath: join(process.cwd(), 'apps', 'backend', 'uploads', 'img'),
      serveRoot: '/uploads/img',
      serveStaticOptions: {
        index: false,   // Evita procurar por index.html
        redirect: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis disponíveis em todos os módulos
      envFilePath: '/.env', // Caminho para o arquivo .env
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
