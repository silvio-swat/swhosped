import { Module } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { AcomodacaoController } from './acomodacao.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Acomodacao } from './../acomodacao/entities/acomodacao.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MikroOrmModule.forFeature([Acomodacao]),
    MulterModule.register({
      dest: './uploads', // Diretório padrão para uploads
    }),
  ],
  controllers: [AcomodacaoController],
  providers: [AcomodacaoService],
})
export class AcomodacaoModule {}
