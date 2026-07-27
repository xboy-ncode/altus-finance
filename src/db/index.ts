import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// For edge environments (Vercel Edge Functions, etc.), you might need a different driver
// but for standard Node.js/Serverless, postgres-js is excellent.
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })
