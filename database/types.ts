import type { Generated } from 'kysely'

/**
 * The Kysely database schema.
 *
 * Each table gets its own interface. `Generated<T>` marks columns whose
 * value the database produces (auto-increment id, default timestamps):
 * they are optional on insert and always present on select.
 */
export interface ProductsTable {
  id: Generated<number>
  title: string
  artist: string
  release_year: number | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface Database {
  products: ProductsTable
}
