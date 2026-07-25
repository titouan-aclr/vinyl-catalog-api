import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Migrator } from 'kysely/migration'
import type { Migration, MigrationProvider } from 'kysely/migration'
import { readdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import * as path from 'node:path'
import app from '@adonisjs/core/services/app'

/**
 * Loads migrations from a folder. Unlike Kysely's built-in FileMigrationProvider,
 * it imports files through file:// URLs, which absolute paths require on Windows
 * under ESM.
 */
class EsmFileMigrationProvider implements MigrationProvider {
  constructor(private folder: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {}
    const files = await readdir(this.folder)

    for (const file of files.sort()) {
      if (!/\.(?:js|ts|mjs)$/.test(file) || file.endsWith('.d.ts')) {
        continue
      }
      const importUrl = pathToFileURL(path.join(this.folder, file)).href
      migrations[file.replace(/\.(?:js|ts|mjs)$/, '')] = (await import(importUrl)) as Migration
    }

    return migrations
  }
}

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
      provider: new EsmFileMigrationProvider(app.makePath('database/migrations')),
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
