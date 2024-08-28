import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { dbUrl } from '../../constants/env'
import * as schema from './schema'

const pool = new Pool({
   connectionString: dbUrl
})

export const db = drizzle(pool, {
   schema
})
