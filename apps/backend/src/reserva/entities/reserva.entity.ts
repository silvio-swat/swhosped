import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Cliente } from './../../cliente/cliente.entity';
import { Acomodacao } from './../../acomodacao/entities/acomodacao.entity';

@Entity()
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
}

export enum StatusReserva {
  CONFIRMADA = 'Confirmada',
  CANCELADA = 'Cancelada',
}
