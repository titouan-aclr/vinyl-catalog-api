import type { Insertable, Kysely, Selectable } from 'kysely'
import type { Database, VariantsTable, VariantStatus } from '#database/types'
import { DuplicateSkuError } from '#exceptions/variant_errors'

export type Variant = Selectable<VariantsTable>
export type NewVariant = Insertable<VariantsTable>

/**
 * A query executor: the shared connection (default) or a transaction. The stock
 * methods accept one so VariantService can run them inside a transaction.
 */
type Executor = Kysely<Database>

export default class VariantRepository {
  constructor(private db: Kysely<Database>) {}

  async create(data: NewVariant): Promise<Variant> {
    try {
      const { insertId } = await this.db
        .insertInto('variants')
        .values(data)
        .executeTakeFirstOrThrow()

      return await this.db
        .selectFrom('variants')
        .selectAll()
        .where('id', '=', Number(insertId))
        .executeTakeFirstOrThrow()
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new DuplicateSkuError()
      }
      throw error
    }
  }

  async findByProductId(productId: number): Promise<Variant[]> {
    return this.db
      .selectFrom('variants')
      .selectAll()
      .where('productId', '=', productId)
      .orderBy('id')
      .execute()
  }

  async findByIdForUpdate(id: number, executor: Executor = this.db): Promise<Variant | undefined> {
    return executor
      .selectFrom('variants')
      .selectAll()
      .where('id', '=', id)
      .forUpdate()
      .executeTakeFirst()
  }

  async updateStock(
    id: number,
    data: { stock: number; status: VariantStatus },
    executor: Executor = this.db
  ): Promise<Variant> {
    await executor
      .updateTable('variants')
      .set({ stock: data.stock, status: data.status, updatedAt: new Date() })
      .where('id', '=', id)
      .execute()

    return executor
      .selectFrom('variants')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }
}
