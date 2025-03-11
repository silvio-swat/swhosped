import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Cliente {
  @PrimaryKey()
  id!: number;

  @Property()
  nome!: string;

  @Property()
  sobrenome!: string;

  @Property()
  telefone!: string;
}
