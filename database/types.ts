import type { Generated } from 'kysely'

/**
 * The Kysely database schema.
 *
 * Columns are declared in camelCase; the CamelCasePlugin (see database/db.ts)
 * maps them to the snake_case column names used in the database. `Generated<T>`
 * marks columns the database produces (auto-increment id, defaults, timestamps):
 * they are optional on insert and always present on select.
 */

export type Format = 'LP' | 'EP' | 'SINGLE' | 'CD' | 'CASSETTE'
export type VariantStatus = 'draft' | 'available' | 'sold_out'

export interface ProductsTable {
  id: Generated<number>
  title: string
  artist: string
  releaseYear: number | null
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface VariantsTable {
  id: Generated<number>
  productId: number
  sku: string
  format: Format
  color: string | null
  priceCents: number
  currency: string
  stock: Generated<number>
  status: Generated<VariantStatus>
  createdAt: Generated<Date>
  updatedAt: Generated<Date>
}

export interface Database {
  products: ProductsTable
  variants: VariantsTable
}
