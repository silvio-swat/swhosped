import { Migration } from '@mikro-orm/migrations';

export class Migration20250331192901 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "reserva" add column "created_at" timestamptz not null default 'now()', add column "updated_at" timestamptz not null;`);
    this.addSql(`alter table "reserva" add constraint "reserva_acomodacao_id_data_check_in_data_check_out_unique" unique ("acomodacao_id", "data_check_in", "data_check_out");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reserva" drop constraint "reserva_acomodacao_id_data_check_in_data_check_out_unique";`);
    this.addSql(`alter table "reserva" drop column "created_at", drop column "updated_at";`);
  }

}
