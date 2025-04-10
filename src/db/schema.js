import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	link: varchar({ length: 255 }).notNull(),
});
