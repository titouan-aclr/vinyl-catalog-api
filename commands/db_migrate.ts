import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Migrator, FileMigrationProvider } from 'kysely/migration'
import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import app from '@adonisjs/core/services/app'

export default class DbMigrate extends BaseCommand {
  static commandName = 'db:migrate'
  static description = 'Run all pending Kysely migrations'
  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const { db } = await import('#database/db')

    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: app.makePath('database/migrations'),
      }),
    })

    const { error, results } = await migrator.migrateToLatest()

    for (const result of results ?? []) {
      if (result.status === 'Success') {
        this.logger.success(`applied migration "${result.migrationName}"`)
      } else if (result.status === 'Error') {
        this.logger.error(`failed to apply migration "${result.migrationName}"`)
      }
    }

    if (error) {
      this.logger.error('Migration failed')
      console.error(error)
      this.exitCode = 1
    } else if (!results?.length) {
      this.logger.info('No pending migrations')
    }
  }
}
