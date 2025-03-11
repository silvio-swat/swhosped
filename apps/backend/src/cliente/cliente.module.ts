import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cliente } from './cliente.entity';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

@Module({
  imports: [MikroOrmModule.forFeature([Cliente])],  
  controllers: [ClienteController],
  providers: [ClienteService]
})
export class ClienteModule {}
