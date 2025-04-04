import { Module } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { ReservaService } from './../reserva/reserva.service';
import { AcomodacaoController } from './acomodacao.controller';
import { AcomodacaoFactory } from './../../database/seeders/acomodacao/acomodacao.factory';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Acomodacao } from './entities/acomodacao.entity';
import { MulterModule } from '@nestjs/platform-express';
import { TipoLogradouroService } from '../../common/services/tipo-logradouro/tipo-logradouro.service'; 
import { ReservaUtilsService } from '../../common/services/reserva-utils.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Acomodacao]),
    MulterModule.register({
      dest: './uploads', // Diretório padrão para uploads
    }),
  ],
  controllers: [AcomodacaoController],
  providers: [AcomodacaoService, ReservaService, AcomodacaoFactory, TipoLogradouroService, ReservaUtilsService],
})
export class AcomodacaoModule {}
