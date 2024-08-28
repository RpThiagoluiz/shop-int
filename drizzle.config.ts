import { defineConfig, type Config } from 'drizzle-kit'

export default defineConfig({
   dialect: 'postgresql',
   schema: './src/infra/db/schema.ts',
   out: './drizzle',
   dbCredentials: {
      url: process.env.DATABASE_URL!
   },
   verbose: true
} satisfies Config)
