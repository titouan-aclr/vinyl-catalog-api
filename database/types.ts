import type { Generated } from 'kysely'

/**
 * The Kysely database schema.
 *
 * Columns are declared in camelCase; the CamelCasePlugin (see database/db.ts)
 * maps them to the snake_case column names used in the database. `Generated<T>`
 * marks columns the database produces (auto-increment id, default timestamps):
 * they are optional on insert and always present on select.
 */
export interface ProductsTable {
  id: Generated<number>
  title: string
  artist: string
  releaseYear: number | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface Database {
  products: ProductsTable
}
