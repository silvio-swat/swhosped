import { Entity, PrimaryKey, Property, Enum, OneToOne, OptionalProps } from '@mikro-orm/core';
import { Cliente } from './../../cliente/cliente.entity';

@Entity()
export class Usuario {
  @PrimaryKey()
  id!: number;

  @Property()
  nomeUsuario!: string;

  @Property()
  senha!: string;

  @Enum(() => TipoAcesso)
  tipoAcesso!: TipoAcesso;

  @OneToOne(() => Cliente, cliente => cliente.usuario, { nullable: true, mappedBy: 'usuario' })
  cliente?: Cliente;

  [OptionalProps]?: 'cliente';
}

export enum TipoAcesso {
  CLIENTE = 'Cliente',
  ADMINISTRADOR = 'Administrador',
}

