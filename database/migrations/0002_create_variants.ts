import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('variants')
    .addColumn('id', sql`bigint unsigned`, (col) => col.primaryKey().autoIncrement())
    .addColumn('product_id', sql`bigint unsigned`, (col) => col.notNull())
    .addColumn('sku', 'varchar(64)', (col) => col.notNull().unique())
    .addColumn('format', 'varchar(20)', (col) => col.notNull())
    .addColumn('color', 'varchar(64)')
    .addColumn('price_cents', sql`int unsigned`, (col) => col.notNull())
    .addColumn('currency', sql`char(3)`, (col) => col.notNull())
    .addColumn('stock', sql`int unsigned`, (col) => col.notNull().defaultTo(0))
    .addColumn('status', 'varchar(20)', (col) => col.notNull().defaultTo('draft'))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addForeignKeyConstraint('variants_product_id_fk', ['product_id'], 'products', ['id'], (cb) =>
      cb.onDelete('cascade')
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('variants').execute()
}
