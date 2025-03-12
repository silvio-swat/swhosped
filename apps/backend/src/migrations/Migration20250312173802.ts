import { Migration } from '@mikro-orm/migrations';

export class Migration20250312173802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cliente" add column "usuario_id" int not null;`);
    this.addSql(`alter table "cliente" add constraint "cliente_usuario_id_foreign" foreign key ("usuario_id") references "usuario" ("id") on update cascade;`);
    this.addSql(`alter table "cliente" add constraint "cliente_usuario_id_unique" unique ("usuario_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cliente" drop constraint "cliente_usuario_id_foreign";`);

    this.addSql(`alter table "cliente" drop constraint "cliente_usuario_id_unique";`);
    this.addSql(`alter table "cliente" drop column "usuario_id";`);
  }

}
