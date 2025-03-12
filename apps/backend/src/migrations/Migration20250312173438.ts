import { Migration } from '@mikro-orm/migrations';

export class Migration20250312173438 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "acomodacao" ("id" serial primary key, "tipo" text check ("tipo" in ('Casa', 'Apartamento', 'Quarto de Hotel')) not null, "descricao" varchar(255) not null, "capacidade" int not null, "tipo_logradouro" varchar(255) not null, "logradouro" varchar(255) not null, "numero" varchar(255) not null, "bairro" varchar(255) not null, "cidade" varchar(255) not null, "estado" varchar(255) not null, "complemento" varchar(255) null, "cep" varchar(255) not null, "latitude" int not null, "longitude" int not null, "preco_por_noite" int not null, "status" text check ("status" in ('Disponível', 'Reservado', 'Em Manutenção')) not null);`);

    this.addSql(`create table "reserva" ("id" serial primary key, "cliente_id" int not null, "acomodacao_id" int not null, "data_check_in" timestamptz not null, "data_check_out" timestamptz not null, "valor_total" int not null, "status" text check ("status" in ('Confirmada', 'Cancelada')) not null);`);

    this.addSql(`create table "usuario" ("id" serial primary key, "nome_usuario" varchar(255) not null, "senha" varchar(255) not null, "tipo_acesso" text check ("tipo_acesso" in ('Cliente', 'Administrador')) not null);`);

    this.addSql(`alter table "reserva" add constraint "reserva_cliente_id_foreign" foreign key ("cliente_id") references "cliente" ("id") on update cascade;`);
    this.addSql(`alter table "reserva" add constraint "reserva_acomodacao_id_foreign" foreign key ("acomodacao_id") references "acomodacao" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reserva" drop constraint "reserva_acomodacao_id_foreign";`);

    this.addSql(`drop table if exists "acomodacao" cascade;`);

    this.addSql(`drop table if exists "reserva" cascade;`);

    this.addSql(`drop table if exists "usuario" cascade;`);
  }

}
