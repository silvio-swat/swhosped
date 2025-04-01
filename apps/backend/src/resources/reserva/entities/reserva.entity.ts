import { Entity, PrimaryKey, Property, ManyToOne, Enum, Unique } from '@mikro-orm/core';
import { Cliente } from './../../cliente/cliente.entity';
import { Acomodacao } from './../../acomodacao/entities/acomodacao.entity';

@Entity()
@Unique({ 
  name: 'UQ_acomodacao_datas', 
  properties: ['acomodacao', 'dataCheckIn', 'dataCheckOut'],
  options: {
    message: 'Já existe uma reserva para esta acomodação no período selecionado'
  }
})
export class Reserva {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Cliente)
  cliente!: Cliente;

  @ManyToOne(() => Acomodacao)
  acomodacao!: Acomodacao;

  @Property()
  dataCheckIn!: Date;

  @Property()
  dataCheckOut!: Date;

  @Property()
  valorTotal!: number;

  @Enum(() => StatusReserva)
  status!: StatusReserva;

  @Property({ default: 'now()' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();  
}

export enum StatusReserva {
  CONFIRMADA = 'Confirmada',
  CANCELADA = 'Cancelada',
}
