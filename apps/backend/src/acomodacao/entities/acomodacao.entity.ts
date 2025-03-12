import { Entity, PrimaryKey, Property, Enum, OneToMany, Collection } from '@mikro-orm/core';
import { Reserva } from './../../reserva/entities/reserva.entity';

@Entity()
export class Acomodacao {
  @PrimaryKey()
  id!: number;

  @Enum(() => TipoAcomodacao)
  tipo!: TipoAcomodacao;

  @Property()
  descricao!: string;

  @Property()
  capacidade!: number;

  @Property()
  tipoLogradouro!: string;

  @Property()
  logradouro!: string;

  @Property()
  numero!: string;

  @Property()
  bairro!: string;

  @Property()
  cidade!: string;

  @Property()
  estado!: string;

  @Property({ nullable: true })
  complemento?: string;

  @Property()
  cep!: string;

  @Property()
  latitude!: number;

  @Property()
  longitude!: number;

  @Property()
  precoPorNoite!: number;

  @Enum(() => StatusAcomodacao)
  status!: StatusAcomodacao;

  @OneToMany(() => Reserva, reserva => reserva.acomodacao)
  reservas = new Collection<Reserva>(this);
}

export enum TipoAcomodacao {
  CASA = 'Casa',
  APARTAMENTO = 'Apartamento',
  QUARTO_HOTEL = 'Quarto de Hotel',
}

export enum StatusAcomodacao {
  DISPONIVEL = 'Disponível',
  RESERVADO = 'Reservado',
  EM_MANUTENCAO = 'Em Manutenção',
}
