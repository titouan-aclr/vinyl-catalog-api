import type { Kysely } from 'kysely'
import type { Database } from '#database/types'
import VariantRepository, { type Variant } from '#repositories/variant_repository'
import { InsufficientStockError, VariantNotFoundError } from '#exceptions/variant_errors'

export default class VariantService {
  constructor(
    private db: Kysely<Database>,
    private variantRepository: VariantRepository
  ) {}

  /**
   * Adjust a variant's stock by `delta` (negative for a sale, positive for a
   * restock) atomically: the row is locked (FOR UPDATE) for the duration of the
   * transaction so concurrent adjustments cannot oversell, the "no negative
   * stock" rule is enforced, and the status is transitioned accordingly.
   */
  async adjustStock(variantId: number, delta: number): Promise<Variant> {
    return this.db.transaction().execute(async (trx) => {
      const variant = await this.variantRepository.findByIdForUpdate(variantId, trx)
      if (!variant) {
        throw new VariantNotFoundError()
      }

      const newStock = variant.stock + delta
      if (newStock < 0) {
        throw new InsufficientStockError(variant.stock, -delta)
      }

      let status = variant.status
      if (status !== 'draft') {
        status = newStock === 0 ? 'sold_out' : 'available'
      }

      return this.variantRepository.updateStock(variantId, { stock: newStock, status }, trx)
    })
  }
}
