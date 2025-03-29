import { Migration } from '@mikro-orm/migrations';

export class Migration20250328125629 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "acomodacao" add column "imagens" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "acomodacao" drop column "imagens";`);
  }

}
