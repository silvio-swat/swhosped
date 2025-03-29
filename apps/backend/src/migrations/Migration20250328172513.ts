import { Migration } from '@mikro-orm/migrations';

export class Migration20250328172513 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "acomodacao" alter column "latitude" type varchar(255) using ("latitude"::varchar(255));`);
    this.addSql(`alter table "acomodacao" alter column "longitude" type varchar(255) using ("longitude"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "acomodacao" alter column "latitude" type int using ("latitude"::int);`);
    this.addSql(`alter table "acomodacao" alter column "longitude" type int using ("longitude"::int);`);
  }

}
