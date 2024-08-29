import { boolean, date, integer, pgTable, text } from 'drizzle-orm/pg-core'

export const measures = pgTable('measures', {
   measure_uuid: text('measure_uuid').primaryKey(),
   customer_code: text('customer_code').notNull(),
   measure_datetime: date('measure_datetime').notNull(),
   measure_type: text('measure_type').notNull(),
   measure_value: integer('measure_value').notNull(),
   has_confirmed: boolean('has_confirmed').default(false),
   image_url: text('image_url').notNull()
})
