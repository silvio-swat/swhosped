import { Module } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { AcomodacaoController } from './acomodacao.controller';
import { AcomodacaoFactory } from './acomodacao.factory';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Acomodacao } from './entities/acomodacao.entity';
import { MulterModule } from '@nestjs/platform-express';
import { TipoLogradouroService } from '../../common/services/tipo-logradouro/tipo-logradouro.service'; 

@Module({
  imports: [
    MikroOrmModule.forFeature([Acomodacao]),
    MulterModule.register({
      dest: './uploads', // Diretório padrão para uploads
    }),
  ],
  controllers: [AcomodacaoController],
  providers: [AcomodacaoService, AcomodacaoFactory, TipoLogradouroService],
})
export class AcomodacaoModule {}
