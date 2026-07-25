import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('products')
    .addColumn('id', sql`bigint unsigned`, (col) => col.primaryKey().autoIncrement())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('artist', 'varchar(255)', (col) => col.notNull())
    .addColumn('release_year', 'integer')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('products').execute()
}
