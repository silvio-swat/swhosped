import { Entity, PrimaryKey, Property, OneToMany, OneToOne, Collection, OptionalProps } from '@mikro-orm/core';
import { Reserva } from './../reserva/entities/reserva.entity';
import { Usuario } from './../usuario/entities/usuario.entity';

@Entity()
export class Cliente {
  @PrimaryKey()
  id!: number;

  @Property()
  nomeCompleto!: string;

  @Property()
  email!: string;

  @Property()
  telefone!: string;

  @Property()
  cpf!: string;

  @OneToMany(() => Reserva, reserva => reserva.cliente)
  reservas = new Collection<Reserva>(this);

  @OneToOne(() => Usuario, usuario => usuario.cliente, { owner: true, nullable: true })
  usuario?: Usuario;

  [OptionalProps]?: 'usuario';
}

