import { Migration } from '@mikro-orm/migrations';

export class Migration20250407185444_add_email_usuario extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "usuario" add column "email" varchar(255) null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "usuario" drop column "email";');
  }

}
