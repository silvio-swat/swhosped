import { Migration } from '@mikro-orm/migrations';

export class Migration20250305150247 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "cliente" ("id" serial primary key, "nome" varchar(255) not null, "sobrenome" varchar(255) not null, "telefone" varchar(255) not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cliente" cascade;`);
  }

}
