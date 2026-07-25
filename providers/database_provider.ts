import type { ApplicationService } from '@adonisjs/core/types'

export default class DatabaseProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Close the Kysely connection pool when the app shuts down,
   * so no connections are left dangling.
   */
  async shutdown() {
    const { db } = await import('#database/db')
    await db.destroy()
  }
}
