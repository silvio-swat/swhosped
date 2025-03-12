import { Migration } from '@mikro-orm/migrations';

export class Migration20250312174527 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cliente" drop constraint "cliente_usuario_id_foreign";`);

    this.addSql(`alter table "cliente" alter column "usuario_id" type int using ("usuario_id"::int);`);
    this.addSql(`alter table "cliente" alter column "usuario_id" drop not null;`);
    this.addSql(`alter table "cliente" add constraint "cliente_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cliente" drop constraint "cliente_usuario_id_foreign";`);

    this.addSql(`alter table "cliente" alter column "usuario_id" type int using ("usuario_id"::int);`);
    this.addSql(`alter table "cliente" alter column "usuario_id" set not null;`);
    this.addSql(`alter table "cliente" add constraint "cliente_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);
  }

}
