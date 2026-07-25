import type { Insertable, Kysely, Selectable } from 'kysely'
import type { Database, ProductsTable } from '#database/types'

export type Product = Selectable<ProductsTable>
export type NewProduct = Insertable<ProductsTable>

export default class ProductRepository {
  constructor(private db: Kysely<Database>) {}

  async create(data: NewProduct): Promise<Product> {
    const { insertId } = await this.db.insertInto('products').values(data).executeTakeFirstOrThrow()

    return this.db
      .selectFrom('products')
      .selectAll()
      .where('id', '=', Number(insertId))
      .executeTakeFirstOrThrow()
  }

  async findAll(params: { limit: number; offset: number }): Promise<Product[]> {
    return this.db
      .selectFrom('products')
      .selectAll()
      .orderBy('id')
      .limit(params.limit)
      .offset(params.offset)
      .execute()
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.db.selectFrom('products').selectAll().where('id', '=', id).executeTakeFirst()
  }
}
