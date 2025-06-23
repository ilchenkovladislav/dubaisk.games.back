import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const onlinefixTable = pgTable('onlinefix', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
})

export const freetpTable = pgTable('freetp', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 255 }).notNull(),
})
