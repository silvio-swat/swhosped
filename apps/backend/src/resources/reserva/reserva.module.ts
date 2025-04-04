import { Module } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Acomodacao } from '../acomodacao/entities/acomodacao.entity';
import { ReservaUtilsService } from '../../common/services/reserva-utils.service';

@Module({
  imports: [MikroOrmModule.forFeature([Reserva, Cliente, Acomodacao])],
  controllers: [ReservaController],
  providers: [ReservaService, ReservaUtilsService],
})
export class ReservaModule {}
