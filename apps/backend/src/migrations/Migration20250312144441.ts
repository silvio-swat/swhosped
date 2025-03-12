import { Migration } from '@mikro-orm/migrations';

export class Migration20250312144441 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cliente" drop column "nome", drop column "sobrenome";`);

    this.addSql(`alter table "cliente" add column "nome_completo" varchar(255) not null, add column "email" varchar(255) not null, add column "cpf" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cliente" drop column "nome_completo", drop column "email", drop column "cpf";`);

    this.addSql(`alter table "cliente" add column "nome" varchar(255) not null, add column "sobrenome" varchar(255) not null;`);
  }

}
