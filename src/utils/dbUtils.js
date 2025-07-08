import { db } from './src/db/index.js'

export async function getExistingGames(table) {
  return await db.select().from(table)
}

export async function saveGamesToDatabase(table, games) {
  if (games.length === 0) {
    return
  }

  console.log(`Сохранение ${games.length} новых игр:`, games)
  await db.insert(table).values(games)
}
