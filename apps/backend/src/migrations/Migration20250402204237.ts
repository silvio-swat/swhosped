import { Migration } from '@mikro-orm/migrations';

export class Migration20250402204237 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "reserva" ADD COLUMN "created_at" TIMESTAMPTZ;`);
    this.addSql(`ALTER TABLE "reserva" ADD COLUMN "updated_at" TIMESTAMPTZ;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reserva" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "reserva" alter column "created_at" set not null;`);
    this.addSql(`alter table "reserva" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "reserva" alter column "updated_at" set not null;`);
  }

}
