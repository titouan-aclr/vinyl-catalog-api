import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import env from '#start/env'
import type { Database } from '#database/types'

const dialect = new MysqlDialect({
  pool: createPool({
    host: env.get('DB_HOST'),
    port: env.get('DB_PORT'),
    user: env.get('DB_USER'),
    password: env.get('DB_PASSWORD'),
    database: env.get('DB_DATABASE'),
  }),
})

export const db = new Kysely<Database>({ dialect })
