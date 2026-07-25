import type { ApplicationService } from '@adonisjs/core/types'
import VariantRepository from '#repositories/variant_repository'
import VariantService from '#services/variant_service'

export default class ServicesProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Bind services to the IoC container, wired with the shared Kysely
   * connection and their repositories, so controllers can inject them.
   */
  register() {
    this.app.container.singleton(VariantService, async () => {
      const { db } = await import('#database/db')
      const variantRepository = await this.app.container.make(VariantRepository)
      return new VariantService(db, variantRepository)
    })
  }
}
