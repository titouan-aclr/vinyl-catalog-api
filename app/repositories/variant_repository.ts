import type { Insertable, Kysely, Selectable } from 'kysely'
import type { Database, VariantsTable } from '#database/types'

export type Variant = Selectable<VariantsTable>
export type NewVariant = Insertable<VariantsTable>

export default class VariantRepository {
  constructor(private db: Kysely<Database>) {}

  async create(data: NewVariant): Promise<Variant> {
    const { insertId } = await this.db.insertInto('variants').values(data).executeTakeFirstOrThrow()

    return this.db
      .selectFrom('variants')
      .selectAll()
      .where('id', '=', Number(insertId))
      .executeTakeFirstOrThrow()
  }

  async findByProductId(productId: number): Promise<Variant[]> {
    return this.db
      .selectFrom('variants')
      .selectAll()
      .where('productId', '=', productId)
      .orderBy('id')
      .execute()
  }
}
