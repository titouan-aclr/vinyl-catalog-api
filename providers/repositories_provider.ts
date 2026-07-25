import type { ApplicationService } from '@adonisjs/core/types'
import ProductRepository from '#repositories/product_repository'
import VariantRepository from '#repositories/variant_repository'

export default class RepositoriesProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Bind repositories to the IoC container, each wired with the shared
   * Kysely connection, so controllers and services can inject them by type.
   */
  register() {
    this.app.container.singleton(ProductRepository, async () => {
      const { db } = await import('#database/db')
      return new ProductRepository(db)
    })

    this.app.container.singleton(VariantRepository, async () => {
      const { db } = await import('#database/db')
      return new VariantRepository(db)
    })
  }
}
